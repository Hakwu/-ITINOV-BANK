
import React, {useEffect, useState} from "react";
import CustomSelect from "../Component/CustomSelect";
import axios from "axios";
import Loader from "../Component/Loader";

interface User {
    userId: string;
    firstName: string;
    lastName: string;
}

interface OperationProps {
    data: User;
}

interface Account {
    accountId: string;
    userId: string;
    accountType: string;
    balance: number;
    currency: string;
}

function Operation({data} : OperationProps) {
    const [account, setAccount] = useState<Account[]>([]);
    const [fromAccount, setFromAccount] = useState<Account | undefined>(undefined);
    const [amount, setAmount] = useState('...');
    const [choice, setChoice] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    function selectMyChoice(choice: string) {
        setChoice(choice);
    }

    function setReset() {
        window.location.reload();
    }

    useEffect(() => {
        fetchData();
    },[data.userId])

    async function submitOperation() {
        if (fromAccount && choice && amount !== "...") {
            try {
                await axios.post(`http://localhost:8080/api/v1/transaction/operation`,
                    {fromAccountId: fromAccount.accountId, type: choice, amount: amount}).then((response) => {
                    if (response.status === 200) {
                        setStatus("success")
                        setMessage("La transaction a bien été effectuée.");
                    }
                })
            } catch (e) {
                setMessage("Une erreur s'est produite, veuillez réessayer.");
                setStatus("")
                console.error('Error sending data:', e);
            }
        }
    }
    async function fetchData() {
        try {
            await axios.get(`http://localhost:8080/api/v1/account/user/${data.userId}`).then(response => {
                const userAccount = response.data.data.map((account: { accountType: string; currency: string; balance:number;}) => ({
                    ...account,
                    balance: transformBalance(account.balance),
                    currency: transformCurrency(account.currency),
                    accountType: transformType(account.accountType)
                }));
                setAccount(userAccount);
            })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        function transformBalance(balance:number) {
            return balance.toFixed(2);
        }
        function transformCurrency(currency: string) {
            return currency === 'EURO' ? "€" : currency;
        }
        function transformType(type: string) {
            return type === 'CHECKING' ? 'de dépôt' : 'épargne';
        }
    }
    return <section>
        <div className="operation-section">
            <h1 className="transaction-title">OPERATION</h1>
            <p className="ask-transaction-info">Depuis quel compte ?</p>
            <CustomSelect account={account} selectedAccount={setFromAccount} value={fromAccount}/>
            {fromAccount &&
                <div>
                    <div className="part2">
                        <div className="choice-operation">
                            <p className="ask-2nd-part">Quelle opération souhaitez-vous effectuer ?</p>
                            <div className="choice-container">
                                <div className={`deposit-choice ${choice === "DEPOSIT" ? "active" : ""}`}
                                     onClick={() => selectMyChoice("DEPOSIT")}>
                                    DÉPÔT
                                </div>
                                <div className={`withdraw-choice ${choice === "WITHDRAW" ? "active" : ""}`}
                                     onClick={() => selectMyChoice("WITHDRAW")}>
                                    RETRAIT
                                </div>
                            </div>
                        </div>
                        <div style={{width: "100%"}}>
                            <p className="ask-2nd-part">Montant</p>
                            <div style={{paddingTop: 20, paddingBottom: 30}}>
                                <div className="contain-amount">
                                    <input className="amount"
                                           type="number"
                                           min="0"
                                           value={amount}
                                           onChange={(e) => setAmount(e.target.value)}></input>
                                    <div style={{fontSize: 32}}>€</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="submit-section">
                        <div className="confirmation-section">
                            <p>Vous allez effectuer
                                un <span>{choice === "DEPOSIT" ? "dépôt" : "retrait"}</span> de <span>{amount}{fromAccount.currency}</span> {choice === "DEPOSIT" ? "sur" : "depuis"} le
                                compte <span>{fromAccount.accountType}.</span></p>
                        </div>
                        <div className="submit-button" onClick={submitOperation}>
                            <button>Valider</button>
                        </div>
                    </div>
                </div>
            }
        </div>
        <div className={`modal-contain ${message === "" ? "" : "show"}`}>
            <div className="status-modal">
                <span className="material-symbols-outlined close-modal" onClick={setReset}>close</span>
                <Loader status={status}></Loader>
                <h1>{message}</h1>
                <div className="modal-button">
                    <button onClick={setReset}>D'accord</button>
                </div>
            </div>
        </div>
    </section>
}

export default Operation;
