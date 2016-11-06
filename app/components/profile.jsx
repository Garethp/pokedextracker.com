import { Component } from 'react';
import { Link }      from 'react-router';
import DocumentTitle from 'react-document-title';
import { connect }   from 'react-redux';

import { DexPreviewComponent }          from './dex-preview';
import { FriendCodeComponent }          from './friend-code';
import { HeaderComponent }              from './header';
import { NavComponent }                 from './nav';
import { NotFoundComponent }            from './not-found';
import { ReloadComponent }              from './reload';
import { checkVersion }                 from '../actions/utils';
import { retrieveUser, setCurrentUser } from '../actions/user';
import { setShowShare }                 from '../actions/tracker';

export class Profile extends Component {

  constructor (props) {
    super(props);
    this.state = { loading: false };
  }

  componentWillMount () {
    this.reset();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.username !== this.props.params.username) {
      this.reset(nextProps);
    }
  }

  reset (props) {
    const { checkVersion, params: { username }, retrieveUser, setCurrentUser, setShowShare } = props || this.props;

    this.setState({ ...this.state, loading: true });

    checkVersion();
    setCurrentUser(username);
    setShowShare(false);

    retrieveUser(username)
    .then(() => this.setState({ ...this.state, loading: false }))
    .catch(() => this.setState({ ...this.state, loading: false }));
  }

  render () {
    const { params: { username }, user } = this.props;
    const { loading } = this.state;

    if (loading) {
      return (
        <DocumentTitle title={`${username}'s Profile | Pokédex Tracker`}>
          <div className="loading">Loading...</div>
        </DocumentTitle>
      );
    }

    if (!user) {
      return <NotFoundComponent />;
    }

    return (
      <DocumentTitle title={`${username}'s Profile | Pokédex Tracker`}>
        <div className="profile-container">
          <NavComponent />
          <ReloadComponent />
          <div className="profile">
            <div className="wrapper">
              <header>
                <HeaderComponent profile={true} />
                <FriendCodeComponent />
              </header>

              {user.dexes.map((dex) => <DexPreviewComponent key={dex.id} dex={dex} />)}

              <div className="dex-create">
                <Link className="btn btn-blue" to="">Create a New Dex <i className="fa fa-long-arrow-right" /></Link>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }

}

function mapStateToProps ({ currentUser, users }) {
  return { user: users[currentUser] };
}

function mapDispatchToProps (dispatch) {
  return {
    checkVersion: () => dispatch(checkVersion()),
    retrieveUser: (username) => dispatch(retrieveUser(username)),
    setCurrentUser: (username) => dispatch(setCurrentUser(username)),
    setShowShare: (show) => dispatch(setShowShare(show))
  };
}

export const ProfileComponent = connect(mapStateToProps, mapDispatchToProps)(Profile);
