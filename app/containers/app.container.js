// React library
import React from 'react';

// Axios of Ajax
import Axios from 'axios';

// Sound component
import Sound from 'react-sound';

// Import Search Component
import Search from '../components/search.component';

// Import Details Component
import Details from '../components/details.component';

// Import Player Component
import Player from '../components/player.component';

// Import Player Component
import Progress from '../components/progress.component';

// Import Player Component
import Footer from '../components/footer.component';

// AppContainer class
class AppContainer extends React.Component {
  // AppContainer constructor
  constructor(props) {
    super(props);

    // Client ID
    this.client_id = '0e33561a6bc8ecfb657497a9465805d0';

    // Initial State
    this.state = {
      // What ever is returned, we just need these 3 values
      track: {stream_url: '', title: '', artwork_url: ''},
      playStatus: Sound.status.STOPPED,
      elapsed: '00:00',
      total: '00:00',
      position: 0,
      playFromPosition: 0,
      autoCompleteValue: '',
      tracks: []
    }
  }

  // Random Track Method
  randomTrack() {
    let _this = this;

    //Request for a playlist via Soundcloud using a client id
    Axios.get(`https://api.soundcloud.com/playlists/209262931?client_id=${this.client_id}`)
      .then(function (response) {
        // Store the length of the tracks
        const trackLength = response.data.tracks.length;

        // Pick a random number
        const randomNumber = Math.floor((Math.random() * trackLength) + 1);

        // Set the track state with a random track from the playlist
        _this.setState({track: response.data.tracks[randomNumber]});
      })
      .catch(function (err) {
        // If something goes wrong, let us know
        console.log(err);
      })
  }

  // React-Sound Methods
  //----------------------

  // A method in the AppContainer class
  prepareUrl(url) {
    // Attach client id to stream url
    return `${url}?client_id=${this.client_id}`
  }

  //format Milliseconds Method
  formatMilliseconds(milliseconds) {
    // Format hours
    var hours = Math.floor(milliseconds / 3600000);
    milliseconds = milliseconds % 3600000;

    // Format minutes
    var minutes = Math.floor(milliseconds / 60000);
    milliseconds = milliseconds % 60000;

    // Format seconds
    var seconds = Math.floor(milliseconds / 1000);
    milliseconds = Math.floor(milliseconds % 1000);

    // Return as string
    return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }


  // Handle Song Playing Method
  handleSongPlaying(audio) {
    this.setState({
      elapsed: this.formatMilliseconds(audio.position),
      total: this.formatMilliseconds(audio.duration),
      position: audio.position / audio.duration
    })
  }

  // Handle Song Finished Method
  handleSongFinished() {
    // Call random Track
    this.randomTrack();
  }


  // Autocomplete Methods
  //----------------------

  // Autocomplete Handle Select Method
  handleSelect(value, item) {
    this.setState({ autoCompleteValue: value, track: item});
  }

  // Autocomplete Handle Change Method
  handleChange(event, value) {
    //Update input box
    this.setState({autoCompleteValue: event.target.value});
    let _this = this;

    //Search for song with entered value
    Axios.get(`https://api.soundcloud.com/tracks?client_id=${this.client_id}&q=${value}`)
      .then(function (response) {
        // Update tracks state
        _this.setState({tracks: response.data});
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  // Player Methods
  //----------------------

  // togglePlay method
  togglePlay() {
    // Check current playing state
    if(this.state.playStatus === Sound.status.PLAYING){
      // Pause if playing
      this.setState({playStatus: Sound.status.PAUSED})
    } else {
      // Resume if paused
      this.setState({playStatus: Sound.status.PLAYING})
    }
  }

  // Stop playing method
  stop() {
    // Stop sound
    this.setState({playStatus: Sound.status.STOPPED});
  }

  // Forward method
  forward() {
    this.setState({playFromPosition: this.state.playFromPosition+=1000*10});
  }

  // Backward method
  backward() {
    this.setState({playFromPosition: this.state.playFromPosition-=1000*10});
  }


  // componentDidMount lifecycle method. Called once  a component is loaded
  componentDidMounth() {
    this.randomTrack();
  }

  xlArtwork(url) {
    return url.replace(/large/, 't500x500');
  }

  // Render method
  render() {
    const xkStyle = {
      width: '500px',
      height: '500px',
      backgroundImage: `url(${this.xlArtwork(this.state.track.artwork_url)})`
    }
    return (
      <div className="xk_player" style={xkStyle}>
        <Search
          autoCompleteValue={this.state.autoCompleteValue}
          tracks={this.state.tracks}
          handleSelect={this.handleSelect.bind(this)}
          handleChange={this.handleChange.bind(this)}/>
        <Details
          title={this.state.track.title}/>
        <Player
          togglePlay={this.togglePlay.bind(this)}
          stop={this.stop.bind(this)}
          playStatus={this.state.playStatus}
          forward={this.forward.bind(this)}
          backward={this.backward.bind(this)}
          random={this.randomTrack.bind(this)}/>
        <Sound
          url={this.prepareUrl(this.state.track.stream_url)}
          playStatus={this.state.playStatus}
          onPlaying={this.handleSongPlaying.bind(this)}
          playFromPosition={this.state.playFromPosition}
          onFinishedPlaying={this.handleSongFinished.bind(this)}/>
        <Progress
          elapsed={this.state.elapsed}
          total={this.state.total}
          position={this.state.position}/>
        <Footer/>
      </div>
    );
  }
}

// Export AppContainer Component
export default AppContainer
