import "../styles/globals.css";
import "../styles/style.scss";
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />{" "}
    </>
  );
}

export default MyApp;
