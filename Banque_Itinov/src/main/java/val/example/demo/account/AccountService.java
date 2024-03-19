package val.example.demo.account;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import val.example.demo.api.ApiResponse;
import val.example.demo.api.ResponseBuilder;

import java.util.List;

@AllArgsConstructor
@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final ResponseBuilder responseBuilder;

    public ResponseEntity<ApiResponse> getAllAccount() {
        try {
            return responseBuilder.buildResponse(HttpStatus.OK.value(), "", accountRepository.findAll());
        } catch (Exception e) {
            return responseBuilder.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), "");
        }
    }
    public ResponseEntity<ApiResponse> getAccountByAccountId(String accountId) {
        try {
            return responseBuilder.buildResponse(HttpStatus.OK.value(), "", accountRepository.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account not found !")));
        } catch (IllegalArgumentException e) {
            return responseBuilder.buildResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), "");
        } catch (Exception e) {
            return responseBuilder.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), "");
        }
    }
    public List<Account> getAccountByUserId(String userId)
    {
        return accountRepository.findByUserId(userId);
    }
    public ResponseEntity<ApiResponse> getAccountByOwnerId(String userId) {
        try {
            return responseBuilder.buildResponse(HttpStatus.OK.value(), "", accountRepository.findByUserId(userId));
        }
        catch (Exception e) {
            return responseBuilder.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), "");
        }
    }
}
