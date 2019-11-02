import React from "react";
import loader from "./../../Images/loader.svg";

export default class HomePage extends React.Component {
  state = {
    loading: true, //to show loading indicator
    limit: 18, //limit number of items per request
    currentPage: 1, //it holds next page that should fetch
    items: [], //all items save here
    sort: "size", //sort option
    preItems: [] //an array like items[] to save items that will display when user scrolls down(#improve user's experience feature)
  };

  async componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);

    await this.loadMore(true); //first fetch to show
    await this.loadMore(false); //fetch again to save it in preItems (pre-emptively)
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  // componentDidUpdate(prevProps){
  //   console.log(this.state)
  // }

  handleScroll = async () => {
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
      //first show saved items
      await this.setState({
        items: [...this.state.items, ...this.state.preItems],
        preItems: [],
        loading: true
      });
      //then fetch new items and save it into preItems state
      await this.loadMore(false);
      await this.setState({
        loading: false
      });
    }
  };

  loadMore = async show => {
    const { limit, currentPage, sort } = this.state;

    const response = await fetch(
      `/api/products?_limit=${limit}&_page=${currentPage}&_sort=${sort}`
    );
    const json = await response.json();

    this.setState({
      currentPage: this.state.currentPage + 1
    });
    if (show) {
      this.setState({
        items: [...this.state.items, ...json]
      });
    } else {
      this.setState({
        preItems: [...this.state.preItems, ...json]
      });
    }
  };

  showItems() {
    var renderOutPut = [];

    for (const value of this.state.items) {
      renderOutPut.push(
        <div key={value.id} className="ItemOuter">
          <div className="Item" style={{ fontSize: value.size + "px" }}>
            {value.face}
          </div>
          <div>Size: {value.size}</div>
          <div>Price: ${value.price / 100}</div>
          <div className="ItemDate">{this.toRelative(value.date)}</div>
        </div>
      );
    }
    return renderOutPut;
  }

  toRelative = previous => { //convert date to relative mode. e.g 15 seconds ago
    const current = new Date();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;

    var elapsed = current - new Date(previous);

    if (elapsed < msPerMinute) {
      return Math.floor(elapsed / 1000) + " seconds ago";
    } else if (elapsed < msPerHour) {
      return Math.floor(elapsed / msPerMinute) + " minutes ago";
    } else if (elapsed < msPerDay) {
      return Math.floor(elapsed / msPerHour) + " hours ago";
    } else if (elapsed < msPerDay * 8) {
      return Math.floor(elapsed / msPerDay) + " days ago";
    } else {
      return new Date(previous).toDateString();
    }
  };

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

  handleChange = async event => { //when sort option changes, reload all the items
    await this.setState({
      sort: event.target.value,
      items: [],
      currentPage: 1
    });
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
