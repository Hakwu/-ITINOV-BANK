import React, {useEffect, useState} from "react";

function Loader({ status }: { status: string }) {
    const [test, setTest] = useState<string>(status);
    useEffect(() => {
        setTest(status)
    }, [status]);

    return (
        test === "success" ?
            <div className="swal2-icon swal2-success swal2-animate-success-icon" style={{ display: "flex" }}>
                <div className="swal2-success-circular-line-left" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                <span className="swal2-success-line-tip"></span>
                <span className="swal2-success-line-long"></span>
                <div className="swal2-success-ring"></div>
                <div className="swal2-success-fix" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                <div className="swal2-success-circular-line-right" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
            </div> :
            <div className="swal2-icon swal2-error swal2-animate-error-icon" style={{ display: "flex" }}>
                <span className="swal2-x-mark">
                    <span className="swal2-x-mark-line-left"></span>
                    <span className="swal2-x-mark-line-right"></span>
                </span>
            </div>
    );
}

export default Loader;
