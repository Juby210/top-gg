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
      const fixImages = document.createElement('style');
      fixImages.innerHTML = `
        body {
            overflow-wrap: break-word;
            object-fit: contain;}
        body * {
            max-width:100%;
            max-height:100%;
        }`;
      doc.head.appendChild(fixImages);
      const func = _.debounce(() => {
        this.setState({ height: `${doc.body.scrollHeight}px` });
      }, 60, { leading:true,
        trailing:true });
      const scrollfix = () => {
        if (this.state.height !== `${doc.body.scrollHeight}px`) {
          func();
        }
      };
      this.state.interval = setInterval(scrollfix, 30);
      scrollfix();
      setTimeout(() => {
        ReactDOM.render(this.props.children, doc.body);
      }, 200);
    } else {
      setTimeout(this.renderFrameContents, 0);
    }
  }
}
module.exports = Frame;
