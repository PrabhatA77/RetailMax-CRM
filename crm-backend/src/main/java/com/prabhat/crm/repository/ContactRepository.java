package com.prabhat.crm.repository;

import com.prabhat.crm.dto.CompanyCount;
import com.prabhat.crm.dto.StatusCount;
import com.prabhat.crm.model.Contact;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("select new com.prabhat.crm.dto.StatusCount(c.status, count(c)) "
            + "from Contact c group by c.status")
    List<StatusCount> countContactsByStatus();

    @Query("select new com.prabhat.crm.dto.CompanyCount(c.company, count(c)) "
            + "from Contact c where c.company is not null "
            + "group by c.company order by count(c) desc")
    List<CompanyCount> findTopCompanies(Pageable pageable);
}