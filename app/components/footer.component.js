// Import React
import React from 'react';

class Footer extends React.Component {
  render () {
    return(
      <div className="footer">
        <p> Made with <i className="fa fa-heart"></i>
          & <img src="public/img/soundcloud.png" className="soundcloud"/>
        </p>
      </div>
    )
  }
}

export default Footer
