import {} from "react";

function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg px-4 bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#">
            Trello
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-3">
              <li className="nav-item">
                <a href="/login">
                  <button type="button" className="btn btn-danger">
                    Login
                  </button>
                </a>
              </li>
              <li className="">
                <a href="/register">
                  {" "}
                  <button type="button" className="btn btn-danger">
                    Register
                  </button>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
