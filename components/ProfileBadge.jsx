const { React } = require('powercord/webpack');
const { get } = require('powercord/http');
module.exports = class SVGBadge extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      badge: {}
    };
  }

  async componentDidMount () {
    const badge = await get(`https://top.gg/api/widget/${this.props.id}.svg`);
    if (badge.body.toString().includes('<?xml')) {
      const transform = document.createElement('div');
      transform.innerHTML = badge.body.toString();
      const svg = transform.querySelector('svg');
      svg.style.width = '100%';
      svg.style.height = '100%';
      this.setState({
        badge: { body: transform.innerHTML }
      });
    }
  }

  render () {
    return (
      <>
        {this.state.badge.body && (
          <div className="discord-bot-svg" dangerouslySetInnerHTML={{ __html: this.state.badge.body }}/>
        )}
      </>
    );
  }
};
