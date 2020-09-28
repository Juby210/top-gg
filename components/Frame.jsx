// updated from https://medium.com/@ryanseddon/rendering-to-iframes-in-react-d1cb92274f86
const { React, ReactDOM } = require('powercord/webpack');
class Frame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      height: '100%'
    };
  }

  render () {
    return <iframe style={{ height: this.state.height,
      width:'100%',
      display: 'block',
      border: 'none',
      margin: 0,
      padding: 0 }} />;
  }

  componentDidMount () {
    this.renderFrameContents();
  }

  componentWillUnmount () {
    clearInterval(this.state.interval);
  }

  renderFrameContents () {
    const doc = ReactDOM.findDOMNode(this).contentDocument;
    if (doc.readyState === 'complete') {
      ReactDOM.render(this.props.children, doc.body);
      Array.prototype.forEach.call(document.querySelectorAll('link[rel=stylesheet]'), (link) => {
        const newLink = document.createElement('link');
        newLink.rel = link.rel;
        newLink.href = link.href;
        doc.head.appendChild(newLink);
      });
      Array.prototype.forEach.call(document.querySelectorAll('style'), (link) => {
        const newLink = document.createElement('style');
        newLink.innerHTML = link.innerHTML;
        doc.head.appendChild(newLink);
      });
      this.state.interval = setInterval(() => {
        if (this.state.height !== `${doc.body.scrollHeight}px`) {
          this.setState({ height: `${doc.body.scrollHeight}px` });
        }
      }, 100);
    } else {
      setTimeout(this.renderFrameContents, 0);
    }
  }
}
module.exports = Frame;
