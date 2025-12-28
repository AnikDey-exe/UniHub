package com.unihub.app.service;

import com.unihub.app.dto.AppUserDTO;
import com.unihub.app.dto.DTOMapper;
import com.unihub.app.dto.EmailDTO;
import com.unihub.app.dto.request.LoginRequest;
import com.unihub.app.dto.request.UpdateUserRequest;
import com.unihub.app.dto.response.VerificationResponse;
import com.unihub.app.exception.CollegeNotFoundException;
import com.unihub.app.exception.InvalidEmailException;
import com.unihub.app.exception.UnsupportedMediaTypeException;
import com.unihub.app.exception.UserNotFoundException;
import com.unihub.app.model.AppUser;
import com.unihub.app.model.College;
import com.unihub.app.repository.AppUserRepo;
import com.unihub.app.repository.CollegeRepo;
import com.unihub.app.repository.EventRepo;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.*;

import static com.unihub.app.util.FileOperations.getFileExtension;
import static com.unihub.app.util.UrlFormatter.extractEmailDomain;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppUserService {
    @Autowired
    private EventRepo eventRepo;
    @Autowired
    private AppUserRepo appUserRepo;
    @Autowired
    private DTOMapper dtoMapper;
    @Autowired
    private EmailService emailService;
    @Autowired
    private CollegeRepo collegeRepo;

    private final S3Client s3Client;

    @Value("${cloudflare.r2.bucket}")
    private String bucket;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public List<AppUserDTO> getAllUsers(){
        List<AppUser> appUsers = appUserRepo.findAll();
        List<AppUserDTO> appUserDTOS = new ArrayList<AppUserDTO>();
        for(AppUser user: appUsers) {
            appUserDTOS.add(dtoMapper.toAppUserDTO(user));
        }
        return appUserDTOS;
    }

    public AppUserDTO saveUser(AppUser userInput, MultipartFile image) throws FileUploadException {
        if (userInput.getEmail() == null || !userInput.getEmail().endsWith(".edu")) {
            throw new InvalidEmailException("Only university provided emails are allowed");
        }

        AppUser user = new AppUser();

        String profilePicture = "";
        if (image != null) {
            String original = Optional.ofNullable(image.getOriginalFilename())
                    .orElseThrow(() -> new UnsupportedMediaTypeException("Filename is missing"))
                    .toLowerCase();
            String contentType = Optional.ofNullable(image.getContentType())
                    .orElseThrow(() -> new UnsupportedMediaTypeException("Content-Type is unknown"));

            String ext = getFileExtension(original);
            String folder = switch (ext) {
                case "jpg", "jpeg", "png", "gif" -> "images";
                case "mp4", "mov" -> "videos";
                case "pdf", "doc", "docx", "txt" -> "documents";
                default -> throw new UnsupportedMediaTypeException("Unsupported file type: " + contentType);
            };

            String key = String.format("%s/%s-%s", folder, UUID.randomUUID(), original);

            PutObjectRequest req = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(contentType)
                    .build();

            try {
                s3Client.putObject(req, RequestBody.fromBytes(image.getBytes()));
            } catch (IOException e) {
                throw new FileUploadException("File upload to Cloudflare R2 failed", e);
            }

            // in prod change this to custom domain
            profilePicture = String.format("https://pub-13855262101b49ee8952e3133c109be0.r2.dev/%s", key);
        }

        user.setId(userInput.getId());
        user.setEmail(userInput.getEmail());
        user.setPhoneNumber(userInput.getPhoneNumber());
        user.setFirstName(userInput.getFirstName());
        user.setMiddleName(userInput.getMiddleName());
        user.setLastName(userInput.getLastName());
        user.setAbout(userInput.getAbout());
        user.setProfilePicture(profilePicture);
        user.setPassword(passwordEncoder.encode(userInput.getPassword()));

        String domain = extractEmailDomain(user.getEmail());
        String thumbnail = "https://img.logo.dev/" + domain + "?token=pk_EtlQcX5eTPGp1A5PzwNTPQ";

        College college = collegeRepo
                .findByThumbnail(thumbnail)
                .orElseThrow(() -> new CollegeNotFoundException("College not found"));

        user.setCollege(college);

        AppUser savedUser = appUserRepo.save(user);
        AppUserDTO userDTO = dtoMapper.toAppUserDTO(savedUser);
        log.info("User with name: {} saved successfully", user.getFirstName());
        return userDTO;
    }

    public VerificationResponse sendVerificationEmail(String userEmail) {
        Random random = new Random();
        DecimalFormat decimalFormat = new DecimalFormat("000000");

        int randomNumber = random.nextInt(999999)+1;
        String verificationCode = decimalFormat.format(randomNumber);

        EmailDTO email = new EmailDTO(userEmail, "Your verification code is "+verificationCode, "UniHub: Verify Your Identity");
        emailService.sendSimpleEmailAsync(email);

        return new VerificationResponse(verificationCode);
    }

    public AppUser login(LoginRequest userInput) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userInput.getEmail(),
                        userInput.getPassword()
                )
        );

        AppUser user = appUserRepo.findByEmail(userInput.getEmail()).orElseThrow(() -> new UserNotFoundException("User not found"));
        // check if password length is not 0 because if it is then it is OAuth2 Account
        return user;
    }

    public AppUserDTO updateUserProfile(Integer id, UpdateUserRequest toUpdate, MultipartFile image) throws FileUploadException {
        AppUser user = appUserRepo.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));

        if (toUpdate.getFirstName() != null) user.setFirstName(toUpdate.getFirstName());
        if (toUpdate.getLastName() != null) user.setLastName(toUpdate.getLastName());
        if (toUpdate.getMiddleName() != null) user.setMiddleName(toUpdate.getMiddleName());
        if (toUpdate.getPhoneNumber() != null) user.setPhoneNumber(toUpdate.getPhoneNumber());
        if (toUpdate.getAbout() != null) user.setAbout(toUpdate.getAbout());
        if (image != null) {
            String original = Optional.ofNullable(image.getOriginalFilename())
                    .orElseThrow(() -> new UnsupportedMediaTypeException("Filename is missing"))
                    .toLowerCase();
            String contentType = Optional.ofNullable(image.getContentType())
                    .orElseThrow(() -> new UnsupportedMediaTypeException("Content-Type is unknown"));

            String ext = getFileExtension(original);
            String folder = switch (ext) {
                case "jpg", "jpeg", "png", "gif" -> "images";
                case "mp4", "mov" -> "videos";
                case "pdf", "doc", "docx", "txt" -> "documents";
                default -> throw new UnsupportedMediaTypeException("Unsupported file type: " + contentType);
            };

            String key = String.format("%s/%s-%s", folder, UUID.randomUUID(), original);

            PutObjectRequest req = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(contentType)
                    .build();

            try {
                s3Client.putObject(req, RequestBody.fromBytes(image.getBytes()));
            } catch (IOException e) {
                throw new FileUploadException("File upload to Cloudflare R2 failed", e);
            }

            // in prod change this to custom domain
            String profilePicture = String.format("https://pub-13855262101b49ee8952e3133c109be0.r2.dev/%s", key);
            user.setProfilePicture(profilePicture);
        }

        AppUser updatedUser = appUserRepo.save(user);
        return dtoMapper.toAppUserDTO(updatedUser);
    }

    public AppUserDTO me(String email) {
        AppUser user = appUserRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
        return dtoMapper.toAppUserDTO(user);
    }
}
