function Forbidden() {
    return (
        <>
            <div className="d-flex align-items-center justify-content-center vh-100">
                <div className="text-center">
                    <strong className="display-1">403</strong>
                    <p className="my-3 lead">
                        Forbidden
                    </p>
                    <a href="/" className="btn btn-success">Return to home</a>
                </div>
            </div>
        </>
    );
}

export default Forbidden;