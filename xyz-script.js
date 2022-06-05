let minu_conf

const handleOpenMinu = () => {
  const { m_con, m_class, m_site, m_tok } = minu_conf;
  let m_space = document.getElementById(m_con);
  let m_fra = document.getElementById("m_fra");
  if (!m_fra) {
    m_fra = document.createElement("iframe");
    m_fra.setAttribute("id", "m_fra");
    m_fra.setAttribute("class", m_class);
    m_fra.setAttribute("frameborder", "0");
    m_fra.setAttribute("src", `${m_site}/?data=${m_tok}`);
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

window.minu = class {
  
  boot({
    dev = false,
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
        m_site: dev ? "https://dev-benefi.minu.mx" : "https://benefi.minu.mx",
        m_tok, m_btn, m_con, m_class,
      }
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
