package val.example.demo.account;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AccountRepository extends MongoRepository<Account, String> {
    List <Account> findByUserId(String UserId);
}
