package val.example.demo.account;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import val.example.demo.enums.AccountType;
import val.example.demo.enums.Currency;

@Data
@Document
public class Account {
        @Id
        private String accountId;
        private String userId;
        private AccountType accountType;
        private double balance;
        private Currency currency;

    public Account(String userId, AccountType accountType, double balance, Currency currency) {
        this.userId = userId;
        this.accountType = accountType;
        this.balance = balance;
        this.currency = currency;
    }

    public void deposit(double amount) {
        balance += amount;
    }
    public void withdraw(double amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Balance can't be negative.");
        }
        if (amount > balance) {
            throw new IllegalStateException("Insufficient balance");
        }
        balance -= amount;
    }
}

