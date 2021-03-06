const {
  React,
  getModule,
  i18n: { Messages }
} = require('powercord/webpack');
const { Spinner } = require('powercord/components');

const { AdvancedScrollerThin } = getModule([ 'AdvancedScrollerThin' ], false);

const Frame = require('./Frame');


module.exports = class DiscordBot extends React.PureComponent {
  constructor (props) {
    super(props);

    this.classes = {
      empty: getModule([ 'body', 'empty' ], false).empty,
      nelly: getModule([ 'flexWrapper', 'image' ], false).image,
      ...getModule([ 'emptyIcon' ], false)
    };

    this.state = {
      streamerMode: getModule([ 'hidePersonalInformation' ], false)
        .hidePersonalInformation
    };
  }

  async componentDidMount () {
    const { fetchBot, id } = this.props;

    const bot = await fetchBot(id);
    if (!bot) {
      this.setState({
        error: {
          message:
            'Looks like this bot doesn\'t have a top.gg profile',
          icon: this.classes.emptyIconFriends
        }
      });
      return;
    }
    this.setState({ bot });
  }

  render () {
    const { bot, error, streamerMode } = this.state;
    if (streamerMode) {
      return (
        <div className={this.classes.empty}>
          <div className={this.classes.emptyIconStreamerMode} />
          <div className={this.classes.emptyText}>
            {Messages.STREAMER_MODE_ENABLED}
          </div>
        </div>
      );
    } else if (error) {
      const { message, icon } = error;

      return (
        <div className={this.classes.empty}>
          <div className={`${icon || this.classes.nelly} error-icon`} />
          <div className={this.classes.emptyText}>{message}</div>
        </div>
      );
    } else if (!bot) {
      return (
        <div className={this.classes.empty}>
          <Spinner />
        </div>
      );
    }
    return (
      <AdvancedScrollerThin style={{ height:'100%',
        width:'100%',
        display: 'block',
        border: 'none',
        padding: 'none',
        margin: 0 }} className='discord-bot' fade={true}>
        <Frame style={{ height:'100%',
          width:'100%',
          border: 'none',
          margin: 0,
          padding: 0 }} >
          <div dangerouslySetInnerHTML={{ __html: bot }}/>
        </Frame>
      </AdvancedScrollerThin>
    );
  }
};
