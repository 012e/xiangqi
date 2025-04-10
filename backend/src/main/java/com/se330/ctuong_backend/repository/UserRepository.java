package com.se330.ctuong_backend.repository;

import com.se330.ctuong_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsUserBySub(String sub);
}
