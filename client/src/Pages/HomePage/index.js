import React from "react";
import loader from "./../../Images/loader.svg";

export default class HomePage extends React.Component {
  state = {
    loading: true, //to show loading indicator
    limit: 18, //limit number of items per request
    nextPage: 1, //it holds next page that should fetch
    items: [], //all items save here
    sort: "size", //sort option
    preItems: [], //an array like items[] to save items that will display when user scrolls down(#improve user's experience feature)
    allDataShown: false, //to show ~ end of catalogue ~ message
    dataFinished: false //to know when data is finished and be ready to show end message for the next scroll down
  };

  async componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);

    this.adsDB = []; //ads will store here
    await this.loadMore(true); //first fetch to show
    await this.loadMore(false); //fetch again to save it in preItems (pre-emptively)
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }


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

    if (scrolledToBottom && !this.state.loading && !this.state.allDataShown) {
      //first show saved items
      await this.setState({
        items: [...this.state.items, ...this.state.preItems],
        preItems: [],
        loading: true
      });
      if (!this.state.dataFinished) {
        //then fetch new items and save it into preItems state
        await this.loadMore(false);
        this.setState({
          loading: false
        });
      } else {
        //show end message & disable on scroll
        this.setState({
          loading: false,
          allDataShown: true
        });
      }
    }
  };

  loadMore = async show => {
    const { limit, nextPage, sort } = this.state;

    const response = await fetch(
      `/api/products?_limit=${limit}&_page=${nextPage}&_sort=${sort}`
    );
    const json = await response.json();

    if (json.length === 0) {
      //data is finished
      this.setState({
        dataFinished: true
      });
    } else {
      this.setState({
        nextPage: this.state.nextPage + 1
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
    }
  };

  getAdId = () => {
    //generating random ad id when add is displayed as the test wanted
    //ads server api has a small bug. Both r=7 and r=8 have same ad banner!
    let id;
    while (true) {
      id = Math.floor(Math.random() * 10) + 0; //based on backend(handle-ad.js), there is no difference between 0-9 and 0-99999999 in ad real id result,
      if (this.adsDB[this.adsDB.length - 1] !== id) {
        //prevent same ad in a row
        return id;
      }
    }
  };

  showItems() {
    var renderOutPut = [];

    let itemCount = 0;
    let adsCount = 0;
    for (const value of this.state.items) {
      itemCount++;
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

      if (itemCount % 20 === 0) {
        //check add id is exists or not in db
        let adId;
        if (this.adsDB[adsCount] !== undefined) {
          adId = this.adsDB[adsCount];
        } else {
          adId = this.getAdId();
          this.adsDB[adsCount] = adId;
        }
        adId = `/ads/?r=${adId}`;
        renderOutPut.push(
          <div
            className="AdOuter"
            key={"adfor" + itemCount}
            id={"adfor" + itemCount}
          >
            <img className="ad" src={adId} />
          </div>
        );
        adsCount++;
      }
    }

    return renderOutPut;
  }

  toRelative = previous => {
    //convert date to relative mode. e.g 15 seconds ago
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

  handleChange = async event => {
    //when sort option changes, reload all the items
    await this.setState({
      sort: event.target.value,
      items: [],
      nextPage: 1
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
          {this.state.allDataShown ? <p>~ end of catalogue ~</p> : ""}

        </div>
      </div>
    );
  }
}
