package com.prabhat.crm.repository;

import com.prabhat.crm.dto.CompanyCount;
import com.prabhat.crm.dto.StatusCount;
import com.prabhat.crm.model.Contact;
import com.prabhat.crm.model.ContactStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("select new com.prabhat.crm.dto.StatusCount(c.status, count(c)) "
            + "from Contact c group by c.status")
    List<StatusCount> countContactsByStatus();

    @Query("select new com.prabhat.crm.dto.CompanyCount(c.company, count(c)) "
            + "from Contact c where c.company is not null "
            + "group by c.company order by count(c) desc")
    List<CompanyCount> findTopCompanies(Pageable pageable);

    // Total deal value of contacts in one status. Returns null if there are no values to add up.
    @Query("select sum(c.dealValue) from Contact c where c.status = :status")
    BigDecimal sumDealValueByStatus(@Param("status") ContactStatus status);

    // Total deal value of everything NOT in that status (old rows with no status count as open)
    @Query("select sum(c.dealValue) from Contact c where c.status is null or c.status <> :status")
    BigDecimal sumDealValueExcludingStatus(@Param("status") ContactStatus status);
}