package val.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import val.example.demo.account.Account;
import val.example.demo.account.AccountRepository;
import val.example.demo.user.User;
import val.example.demo.user.UserRepository;
import static val.example.demo.enums.AccountType.CHECKING;
import static val.example.demo.enums.AccountType.SAVING;
import static val.example.demo.enums.Currency.EURO;

import java.util.List;

@SpringBootApplication
public class BanqueItinovApplication {

	public static void main(String[] args) { SpringApplication.run(BanqueItinovApplication.class, args);}

	@Bean
	CommandLineRunner runner(UserRepository userRepository, MongoTemplate mongoTemplate, AccountRepository accountRepository)
	{
		return args -> {
			try {
				setupUser(mongoTemplate, userRepository, accountRepository);
			} catch (Exception e) {
				System.err.println("Error occurred during the initialization of the default user : " + e.getMessage());
			}
		};
	}
	private void setupUser(MongoTemplate mongoTemplate, UserRepository userRepository, AccountRepository accountRepository)
	{
		String defaultEmail = "johnDoe@gmail.com";
		Query query = new Query();
		query.addCriteria(Criteria.where("email").is(defaultEmail));
		List<User> users = mongoTemplate.find(query, User.class);

		if (users.isEmpty())
		{
			System.out.println("Inserting default user.");
			User user = new User("John", "Doe", defaultEmail);
			userRepository.insert(user);
			setupUserAccounts(user, mongoTemplate, accountRepository, userRepository);
		} else {
			// Since there is just one user.
			User existingUser = users.get(0);
			System.out.println("The Default user exists.");
			setupUserAccounts(existingUser, mongoTemplate, accountRepository, userRepository);
		}
	}
	private void setupUserAccounts(User user, MongoTemplate mongoTemplate, AccountRepository accountRepository, UserRepository userRepository) {
		try {
			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(user.getUserId()));
			List<Account> userAccounts = mongoTemplate.find(query, Account.class);

			if (userAccounts.isEmpty()) {
				System.out.println("Creating accounts for the user.");
				Account checking = new Account(user.getUserId(), CHECKING, 340, EURO);
				Account saving = new Account(user.getUserId(), SAVING, 1000, EURO);
				accountRepository.insert(checking);
				accountRepository.insert(saving);
				System.out.println("Complete.");
			} else {
				System.out.println("Accounts already set up for the user.");
			}
		} catch (Exception e) {
			System.err.println("Error occurred during the initialization of the account user : " + e.getMessage());
		}
	}
}
