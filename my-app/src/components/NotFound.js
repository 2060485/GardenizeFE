function NotFound() {
    return (
        <>
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
                <strong className="display-1">404</strong>
                <p className="my-3 lead">
                    Page not found.
                  </p>
                <a href="/" className="btn btn-success">Return to home</a>
            </div>
        </div>
        </>
    );
}

export default NotFound;