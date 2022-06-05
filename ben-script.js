let minu_conf;

const handleOpenMinu = () => {
  const { m_con, m_class, m_site, m_tok, m_dev, m_dom } = minu_conf;
  let m_space = document.getElementById(m_con);
  let m_fra = document.getElementById("m_fra");
  if (!m_fra) {
    m_fra = document.createElement("iframe");
    m_fra.setAttribute("id", "m_fra");
    m_fra.setAttribute("class", m_class);
    m_fra.setAttribute("frameborder", "0");
    let m_data = JSON.stringify({ m_tok, m_dev, m_dom });
    console.log(m_site, m_data);
    m_fra.setAttribute("src", `${m_site}/?data=${m_data}`);
    m_space.appendChild(m_fra);
  }
  window.addEventListener("message", handleReceiveMinuMessage);
};

const handleReceiveMinuMessage = event => {
  if (event && event.origin !== minu_conf.m_site) return;
  if (event.data === "close") {
    handleCloseMinu();
  }
};

const handleCloseMinu = () => {
  let m_fra = document.getElementById("m_fra");
  if (m_fra) m_fra.remove();
  window.removeEventListener("message", handleReceiveMinuMessage);
};

window.minu = class minu {
  
  boot({
    dev: m_dev = false,
    token: m_tok,
    btn_id: m_btn,
    con_id: m_con,
    ifr_class: m_class,
  }) {
    if (!m_tok || !m_btn || !m_con || !m_class) {
      console.error("Missing data to boot minu.");
      return;
    } else {
      minu_conf = {
        m_site: `https://${m_dev ? "dev-" : ""}benefi.minu.mx`,
        m_dev, m_tok, m_btn, m_con, m_class,
      }
      if (m_dev) minu_conf["m_dom"] = getDevOrigin();
      const minu_btn = document.getElementById(m_btn);
      minu_btn.addEventListener("click", handleOpenMinu);
    }
  }

  close() {
    handleCloseMinu();
  }

  shutdown() {
    const minu_btn = document.getElementById(minu_conf.m_btn);
    minu_btn.removeEventListener("click", handleOpenMinu);
    window.removeEventListener("message", handleReceiveMinuMessage);
  }

};

const getDevOrigin = () => {
  const url = document.location.href;
  const urlObj = new URL(url);
  return urlObj.origin;
}
