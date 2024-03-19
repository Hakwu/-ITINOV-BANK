
import React, {useState} from "react";
import {Link} from "react-router-dom";

interface FixedButtonProp {
    onButtonClick: (buttonName:string) => void;
}
function FixedButtons({onButtonClick} : FixedButtonProp)
{
    const [showMenu, setShowMenu] = useState("active");
    function interactMenu() {
        const ShowMenuValue = showMenu === "active" ? "" : "active";
        setShowMenu(ShowMenuValue);
    }

    return (
        <div className={`fixed-section-buttons ${showMenu}`}>
            <Link to={"/"}>
                <button disabled={showMenu !== "active"} className="button-action"><span
                    className="material-symbols-outlined">account_balance</span><p>Mes comptes</p></button>
            </Link>
            <Link to={"/transaction"}>
                <button disabled={showMenu !== "active"} className="button-action"><span
                    className="material-symbols-outlined">send_money</span><p>Virements</p></button>
            </Link>
            <Link to={"/operation"}>
                <button disabled={showMenu !== "active"} className="button-action"><span
                    className="material-symbols-outlined">payments</span><p>Opération</p></button>
            </Link>
            <button className="button-menu" onClick={interactMenu}><span className="material-symbols-outlined">{showMenu === "" ? "menu" : "close"}</span></button>
        </div>
    )
}

export default FixedButtons;
