import React from "react";
import loader from "./../../Images/loader.svg";

export default class HomePage extends React.Component {
  state = {
    loading: false,
    limit: 12,
    currentPage: 1,
    items: [],
    sort: "size"
  };

  async componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.loadMore(); //first fetch
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
    const { limit, currentPage, sort } = this.state;
    this.setState({ loading: true });

    const response = await fetch(
      `/api/products?_limit=${limit}&_page=${currentPage}&_sort=${sort}`
    );
    console.log( `/api/products?_limit=${limit}&_page=${currentPage}&_sort=${sort}`)
    const json = await response.json();
    console.log("loaded");
    this.setState({
      items: [...this.state.items, ...json],
      loading: false,
      currentPage: this.state.currentPage + 1
    });
  };

  showItems() {
    var renderOutPut = [];

    for (const value of this.state.items) {
      renderOutPut.push(
        <div key={value.id} className="ItemOuter">
          <div  className="Item" style={{ fontSize: value.size }}>
            {value.face}
          </div>
          <div>Size: {value.size}</div>
          <div>Price: ${value.price/100}</div>
          <div>{(new Date(value.date)).toDateString()}</div>
        </div>
      );
    }
    return renderOutPut;
  }

  showSortOptions = () => {
    var renderOutPut = [];

    renderOutPut.push(
      <option key="size" value="size">
        Size
      </option>
    );
    renderOutPut.push(
      <option key="price" value="price">
        Price
      </option>
    );
    renderOutPut.push(
      <option key="id" value="id">
        ID
      </option>
    );
    return renderOutPut;
  };

  handleChange = async(event) => {
    await this.setState({ sort: event.target.value, items: [], currentPage: 1 });
    this.loadMore(); //first fetch
  };

  render() {
    return (
      <div>
        <div className="OrderBox">
          <p>Order by:</p>
          <select value={this.state.sort} onChange={this.handleChange}>
            {this.showSortOptions()}
          </select>
        </div>
        <div className="Container">
          <div className="ItemContainer">{this.showItems()}</div>
          {this.state.loading ? <img src={loader} /> : ""}
        </div>
      </div>
    );
  }
}
