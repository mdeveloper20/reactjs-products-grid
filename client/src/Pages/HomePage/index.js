import React from "react";

export default class HomePage extends React.Component {
  state = {
    loading: false,
    limit: 12,
    currentPage: 1,
    items: []
  };

  async componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom =
      Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom && !this.state.loading) {
      this.loadMore();
    }
  };

  loadMore = async () => {
    const { limit, currentPage } = this.state;
    this.setState({ loading: true });

    const response = await fetch(
      `/api/products?_limit=${limit}&_page=${currentPage}`
    );
    const json = await response.json();
    console.log(json);
    this.setState({
      items: [...this.state.items, ...json],
      loading: false,
      currentPage: this.state.currentPage + 1
    });
  };

  showItems() {
    var renderOutPut = [];
 
    for(const value of this.state.items){
      renderOutPut.push(<li key={value.id}>{value.price}</li>);

    }
    return renderOutPut;
  }

  render() {
    return (
      <div className="App" style={{ overflow: "auto" }}>
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ul>{this.showItems()}</ul>
        {this.state.loading ? <p className="App-intro">loading ...</p> : ""}
      </div>
    );
  }
}
