
import React from "react";
import {Link, Outlet} from "react-router-dom";
import FixedButtons from "./FixedButtons";

interface User {
    firstName: string;
    lastName: string;
    userId: string;
}

interface MainPageProps {
    data: User;
}

function Header({ data }: MainPageProps)
{
    function handleClick(buttonName:string) {
        if (buttonName === "Send-Money") {

        } else {

        }
    }
    return (
        <>
        <header>
            <nav>
                <Link to={"/"}>
                <div className="logo">
                    <span>
                        ITINOV BANK
                    </span>
                </div>
                </Link>

                {data &&
                <button className={"btn"}>{data.firstName} {data.lastName}</button>
                }
            </nav>
        </header>
            <Outlet />
            <FixedButtons onButtonClick={handleClick}></FixedButtons>
        </>
    )
}

export default Header;
