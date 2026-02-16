package com.unihub.app.repository;

import com.unihub.app.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepo extends JpaRepository<Answer, Integer>  {
}
