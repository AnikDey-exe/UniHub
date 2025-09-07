package com.unihub.app;

import com.unihub.app.dto.DTOMapper;
import org.mapstruct.factory.Mappers;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {
    @Bean
    public DTOMapper dtoMapper() {
        return Mappers.getMapper(DTOMapper.class);
    }
}

