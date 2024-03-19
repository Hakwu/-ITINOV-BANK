package val.example.demo.transaction;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import val.example.demo.enums.TransactionType;
import java.time.LocalDateTime;

@Data
@Document
public class Transaction {
        @Id
        private String transactionId;
        private String fromAccountId;
        private String toAccountId;
        private double amount;
        private LocalDateTime date;
        private TransactionType type;
//        private double fromAccountBalance;
//        private double toAccountBalance;

    public Transaction(String fromAccountId, String toAccountId, double amount, LocalDateTime date, TransactionType type) {
        this.fromAccountId = fromAccountId;
        this.toAccountId = toAccountId;
        this.amount = amount;
        this.date = date;
        this.type = type;
//        this.fromAccountBalance = fromAccountBalance;
//        this.toAccountBalance = toAccountBalance;
    }

}

