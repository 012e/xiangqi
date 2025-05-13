package com.se330.ctuong_backend.config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class Jpa {
    @Converter()
    public class DurationToLongConverter implements AttributeConverter<Duration, Long> {

        @Override
        public Long convertToDatabaseColumn(Duration duration) {
            return (duration == null) ? null : duration.toMillis(); // or toSeconds()
        }

        @Override
        public Duration convertToEntityAttribute(Long millis) {
            return (millis == null) ? null : Duration.ofMillis(millis);
        }
    }
}
