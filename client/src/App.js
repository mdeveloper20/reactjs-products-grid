import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  async componentDidMount(){
    const response=await fetch("/api/products?_limit=5");
    console.log(response);
    const json=await response.json();
    console.log(json);

    
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
  
}

export default App;
