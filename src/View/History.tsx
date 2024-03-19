import React, {useEffect, useState} from "react"
import {useParams} from "react-router-dom";
import axios from "axios";

interface Transaction {
    transactionId: string;
    amount: number;
    day: string;
    date: string;
    toAccountId: string;
    fromAccountId: string;
    type: string;
}

function History() {
    const { accountId } = useParams();
    const [history, setHistory] = useState<Transaction[]>([])
    const mois = ['JANV.', 'FÉVR.', 'MARS', 'AVRI.', 'MAI', 'JUIN', 'JUIL.', 'AOÛT', 'SEPT.', 'OCTO.', 'NOVE.', 'DÉCE.'];

    async function fetchData() {
        try {
            await axios.get(`http://localhost:8080/api/v1/transaction/account/${accountId}`).then(response => {
                const accountTransaction = response.data.data.map((transaction: { day: string; date: string; type: string}) => ({
                    ...transaction,
                    day: new Date(transaction.date).getDate(),
                    date: mois[new Date(transaction.date).getMonth()],
                    type: transaction.type === "RECEIVE" ? "REÇU" : transaction.type === "TRANSFER" ? "TRANSFER" : transaction.type === "WITHDRAW" ? "RETRAIT" : "DÉPÔT",
                }));
                setHistory(accountTransaction);
            })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [accountId]);
    return (
        <section className="history-section">
            <h1 className="transaction-title">MON ACTIVITÉ</h1>
            <div className="container-transaction">
                {history.map((item, index) => (
                        <div key={index} className="transaction-card">
                                <div className="left-part">
                                    <div className="transaction-date">
                                        <div style={{fontWeight: 600, fontSize: "1.6em"}}>{item.day}</div>
                                        <div>{item.date}</div>
                                    </div>
                                    <div className="center-component">
                                        <div className="account-name">{item.type}</div>
                                        <div className="transaction-id">
                                            N°{item.fromAccountId}
                                            {item.toAccountId !== "" &&
                                                (<>
                                                    <span style={item.type === "REÇU" ? {transform: "rotate(-180deg)"} : {}} className="material-symbols-outlined">double_arrow</span>
                                            N°{item.toAccountId}
                                                </>)}
                                        </div>
                                    </div>
                                </div>
                            <div style={item.type === "REÇU" || item.type === "DÉPÔT" ? {color: "green"} : {color: "red"}} className="balance">{item.type === "REÇU" || item.type === "DÉPÔT" ? "+" : "-"} {item.amount}€</div>
                        </div>
                    )
                )}
            </div>
        </section>
    )
}

export default History;
