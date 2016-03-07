import React, { PropTypes, Component } from 'react';

class GoogleLogin extends Component {

  static propTypes = {
    callback: PropTypes.func.isRequired,
    clientId: PropTypes.string.isRequired,
    textButton: PropTypes.string,
    offline: PropTypes.bool,
    scope: PropTypes.string,
    cssClass: PropTypes.string,
    redirectUri: PropTypes.string 
  };


  static defaultProps = {
    textButton: 'Login with Google',
    scope: 'profile email',
    redirectUri: 'postmessage'
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    (function(d, s, id, cb) {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = '//apis.google.com/js/platform.js';
      fjs.parentNode.insertBefore(js, fjs);
      js.onload = cb;
    }(document, 'script', 'google-login', () => {
      const params = {
        client_id: this.props.clientId,
        cookiepolicy: 'single_host_origin'
      }
      window.gapi.load('auth2', () => {
        gapi.auth2.init(params);
      });
    }));
  }

  onBtnClick() {
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (this.props.offline) {
      let options = {
        'scope': this.props.scope,
        'redirect_uri': this.props.redirectUri
      }
      auth2.grantOfflineAccess(options).then((data) => {
        this.props.callback(data)
      });

    } else {
      let options = {
        'scope': this.props.scope
      }
      auth2.signIn(options)
        .then((response) => {
          this.props.callback(response);
        });
    }
  }

  render() {
    return (
      <div>
        <button 
          className={this.props.cssClass} 
          onClick={this.onBtnClick.bind(this)}
        >
          {this.props.buttonText}
        </button>
    </div>
    );
  }
}

export default GoogleLogin;
