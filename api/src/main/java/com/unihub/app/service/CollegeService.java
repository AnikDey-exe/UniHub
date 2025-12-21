package com.unihub.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.unihub.app.dto.CollegeDTO;
import com.unihub.app.dto.DTOMapper;
import com.unihub.app.dto.request.CollegeSearchRequest;
import com.unihub.app.dto.response.SearchedCollegesResponse;
import com.unihub.app.model.College;
import com.unihub.app.repository.CollegeRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static com.unihub.app.util.UrlFormatter.extractDomain;

@Service
@RequiredArgsConstructor
@Slf4j
public class CollegeService {
    @Autowired
    private CollegeRepo collegeRepo;

    @Autowired
    private DTOMapper dtoMapper;

    @Value("${colleges.api-key}")
    private String apiKey;

    @Value("${colleges_image.api-key}")
    private String imageApiKey;

    private final RestTemplate restTemplate;

    @Autowired
    private OpenAIService openAIService;

    @Autowired
    private EntityManager em;

    public List<CollegeDTO> getAllColleges(){
        List<College> colleges = collegeRepo.findAll();
        List<CollegeDTO> collegeDTOs = new ArrayList<CollegeDTO>();

        for (College college : colleges) {
            collegeDTOs.add(dtoMapper.toCollegeDTO(college));
        }

        return collegeDTOs;
    }

    public CollegeDTO saveCollege(College college) {
        College savedCollege = collegeRepo.save(college);
        CollegeDTO collegeDTO = dtoMapper.toCollegeDTO(savedCollege);

        return collegeDTO;
    }

    public SearchedCollegesResponse getColleges(CollegeSearchRequest request) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT *, ");

        float[] embedding = null;
        Float[] embeddingObj = null;
        if (request.getSearchQuery() != null) {
            embedding = openAIService.generateEmbedding(request.getSearchQuery());
            embeddingObj = new Float[embedding.length];

            float norm = 0f;
            for (float f : embedding) {
                norm += f * f;
            }
            norm = (float) Math.sqrt(norm);
            if (norm > 0) {
                for (int i = 0; i < embedding.length; i++) {
                    embedding[i] /= norm;
                }
            }

            for (int i = 0; i < embedding.length; i++) {
                embeddingObj[i] = embedding[i];
            }
            String embeddingLiteral = "[" + Arrays.stream(embeddingObj)
                    .map(f -> Float.toString(f))
                    .collect(Collectors.joining(",")) + "]";

            sql.append("(c.embedding <=> '").append(embeddingLiteral).append("'::vector) AS distance ");
        } else {
            sql.append("NULL AS similarity ");
        }

        sql.append("FROM events.college c WHERE 1=1 ");
        if (request.getLocation() != null) {
            sql.append("AND LOWER(c.location) LIKE LOWER(CONCAT('%', :location, '%')) ");
        }
        if (request.getLastNameASC() != null) {
            sql.append("AND c.name > :name ");
        }

        if (embedding != null) {
            float similarityThreshold = 0.9f;
            String embeddingLiteral = "[" + Arrays.stream(embeddingObj)
                    .map(f -> Float.toString(f))
                    .collect(Collectors.joining(",")) + "]";
            float distanceThreshold = 1 - similarityThreshold;

            sql.append("AND (c.embedding <=> '").append(embeddingLiteral).append("'::vector <= ")
                    .append(distanceThreshold)
                    .append(") ");
        }

        sql.append("ORDER BY ");
        if ("name_asc".equals(request.getSortBy())) {
            sql.append("c.name ASC, ");
        } else {
            sql.append("c.name ASC, ");
        }

        if (embedding != null) {
            String embeddingLiteral = "[" + Arrays.stream(embeddingObj)
                    .map(f -> Float.toString(f))
                    .collect(Collectors.joining(",")) + "]";
            sql.append("(c.embedding <=> '").append(embeddingLiteral).append("'::vector) ASC, ");
        }
        sql.append("c.id ASC ");
        sql.append("LIMIT :limit");

        Query query = em.createNativeQuery(sql.toString(), College.class);

        if (request.getLocation() != null) {
            query.setParameter("location", request.getLocation());
        }
        if (request.getLastNameASC() != null) {
            query.setParameter("name", request.getLastNameASC());
        }
        query.setParameter("limit", request.getLimit());

        List<College> colleges = query.getResultList();
        List<CollegeDTO> collegeDTOs = new ArrayList<>();

        for (College college : colleges) {
            collegeDTOs.add(dtoMapper.toCollegeDTO(college));
        }

        SearchedCollegesResponse response;
        if (colleges.size() == request.getLimit()) {
            response = new SearchedCollegesResponse(
                    collegeDTOs,
                    colleges.get(request.getLimit() - 1).getName(),
                    true
            );
        } else {
            response = new SearchedCollegesResponse(
                    collegeDTOs,
                    "",
                    false
            );
        }

        return response;
    }

    @Async
    public void scrapeColleges() {
        final int PAGES = 1;
        try {
            for (int page = 0; page < 1; page++) {
                String url = "https://api.data.gov/ed/collegescorecard/v1/schools?api_key=" + apiKey + "&page="+page+"&per_page=100&fields=id,school.name,school.school_url,latest.student.size,school.city,school.state";

                HttpHeaders headers = new HttpHeaders();
                headers.set("Content-Type", "application/json");

                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, entity, JsonNode.class);

                JsonNode data = response.getBody().get("results");

                for (int i = 0; i < data.size(); i++) {
                    JsonNode info = data.get(i);

                    String name = info.get("school.name") != null ? info.get("school.name").asText() : "";
                    String location = info.get("school.city") != null && info.get("school.state") != null ? info.get("school.city").asText() + ", " + info.get("school.state").asText() : "";
                    String thumbnail = null;

                    String textForEmbedding = name + name + name;
                    float[] embedding = openAIService.generateEmbedding(textForEmbedding);
                    float norm = 0f;
                    for (float f : embedding) {
                        norm += f * f;
                    }
                    norm = (float) Math.sqrt(norm);

                    if (norm > 0) {
                        for (int j = 0; j < embedding.length; j++) {
                            embedding[j] /= norm;
                        }
                    }

                    StringBuilder sb = new StringBuilder("[");
                    for (int j = 0; j < embedding.length; j++) {
                        sb.append(embedding[j]);
                        if (j < embedding.length - 1) {
                            sb.append(",");
                        }
                    }
                    sb.append("]");
                    String embeddingLiteral = sb.toString();

                    if (info.get("school.school_url") != null) {
                        String extractedUrl = extractDomain(info.get("school.school_url").asText());

                        System.out.println("School name: " + info.get("school.name").asText());
                        System.out.println("Extracted school url: " + extractedUrl);

                        thumbnail = "https://img.logo.dev/" + extractedUrl + "?token=" + imageApiKey;
                    }

                    College college = new College();
                    college.setEmbedding(embedding);
                    college.setName(name);
                    college.setLocation(location);
                    college.setThumbnail(thumbnail);
                    // default image url: "https://uniacco-blog-assets.gumlet.io/blog/wp-content/uploads/2024/04/13162649/college-vs-university-scaled.webp"

                    String sql = String.format("""
                        INSERT INTO events.college (
                            name, location, thumbnail, embedding
                        )
                        VALUES (
                            :name, :location, :thumbnail, '%s'::vector
                        )
                        RETURNING id
                        """, embeddingLiteral);

                    Integer generatedId = (Integer) em.createNativeQuery(sql)
                            .setParameter("name", college.getName())
                            .setParameter("location", college.getLocation())
                            .setParameter("thumbnail", college.getThumbnail())
                            .getSingleResult();

                    college.setId(generatedId);
                }
            }
        } catch (Exception e) {
            log.error("Failed to scrape colleges ", e);
        }
    }
}
