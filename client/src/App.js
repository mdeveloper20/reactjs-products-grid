import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  state={
    ads_src:""
  }

  async componentDidMount(){
    const ads_src="/ads/?r="+ Math.floor(Math.random()*1000);
    this.setState({ads_src});
    // const response=await fetch("/api/products?_limit=5");
    // console.log(response);
    // const json=await response.json();
    // console.log(json);


    
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img className="ad" src={this.state.ads_src}/>

        </header>
      </div>
    );
  }
  
}

export default App;
