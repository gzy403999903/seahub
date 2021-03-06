import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { gettext } from '../../utils/constants';
import CommonToolbar from '../../components/toolbar/common-toolbar';
import ViewModeToolbar from '../../components/toolbar/view-mode-toolbar';
import DirOperationToolBar from '../../components/toolbar/dir-operation-toolbar';
import MutipleDirOperationToolbar from '../../components/toolbar/mutilple-dir-operation-toolbar';
import CurDirPath from '../../components/cur-dir-path';
import DirentListView from '../../components/dirent-list-view/dirent-list-view';
import DirentDetail from '../../components/dirent-detail/dirent-details';
import FileUploader from '../../components/file-uploader/file-uploader';
import RepoInfoBar from '../../components/repo-info-bar';

const propTypes = {
  pathPrefix: PropTypes.array.isRequired,
  currentMode: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  pathExist: PropTypes.bool.isRequired,
  // repo
  currentRepoInfo: PropTypes.object,  // Initially not loaded
  repoID: PropTypes.string.isRequired,
  repoName: PropTypes.string.isRequired,
  repoPermission: PropTypes.bool.isRequired,
  repoEncrypted: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  userPerm: PropTypes.string.isRequired,
  showShareBtn: PropTypes.bool.isRequired,
  enableDirPrivateShare: PropTypes.bool.isRequired,
  isRepoOwner: PropTypes.bool.isRequired,
  isGroupOwnedRepo: PropTypes.bool.isRequired,
  // toolbar
  onTabNavClick: PropTypes.func.isRequired,
  onSideNavMenuClick: PropTypes.func.isRequired,
  selectedDirentList: PropTypes.array.isRequired,
  onItemsMove: PropTypes.func.isRequired,
  onItemsCopy: PropTypes.func.isRequired,
  onItemsDelete: PropTypes.func.isRequired,
  switchViewMode: PropTypes.func.isRequired,
  onSearchedClick: PropTypes.func.isRequired,
  onMainNavBarClick: PropTypes.func.isRequired,
  // repo content
  draftCounts: PropTypes.number,
  reviewCounts: PropTypes.number,
  usedRepoTags: PropTypes.array.isRequired,
  readmeMarkdown: PropTypes.object,
  updateUsedRepoTags: PropTypes.func.isRequired,
  // dirent list
  isDirentListLoading: PropTypes.bool.isRequired,
  direntList: PropTypes.array.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  sortItems: PropTypes.func.isRequired,
  updateDirent: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
  onItemSelected: PropTypes.func.isRequired,
  onItemDelete: PropTypes.func.isRequired,
  onItemRename: PropTypes.func.isRequired,
  onItemMove: PropTypes.func.isRequired,
  onItemCopy: PropTypes.func.isRequired,
  onAddFolder: PropTypes.func.isRequired,
  onAddFile: PropTypes.func.isRequired,
  onFileTagChanged: PropTypes.func.isRequired,
  isDirentSelected: PropTypes.bool.isRequired,
  isAllDirentSelected: PropTypes.bool.isRequired,
  onAllDirentSelected: PropTypes.func.isRequired,
  onFileUploadSuccess: PropTypes.func.isRequired,
};

class LibContentMain extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentDirent: null,
      isDirentDetailShow: false,
    };
  }

  onSideNavMenuClick = () => {
    this.props.onSideNavMenuClick();
  }

  onPathClick = (path) => {
    this.setState({isDirentDetailShow: false});
    this.props.onPathClick(path);
  }

  onItemClick = (dirent) => {
    this.setState({isDirentDetailShow: false});
    this.props.onItemClick(dirent);
  }

  // on '<tr>'
  onDirentClick = (dirent) => {
    if (this.state.isDirentDetailShow) {
      this.onItemDetails(dirent);
    }
  }

  onItemDetails = (dirent) => {
    this.setState({
      currentDirent: dirent,
      isDirentDetailShow: true,
    });
  }

  onItemDetailsClose = () => {
    this.setState({isDirentDetailShow: false});
  }

  onUploadFile = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    this.uploader.onFileUpload();
  }

  onUploadFolder = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    this.uploader.onFolderUpload();
  }

  switchViewMode = (mode) => {
    this.props.switchViewMode(mode);
  }

  onFileUploadSuccess = (direntObject) => {
    this.props.onFileUploadSuccess(direntObject);
  }

  renderListView = () => {
    let repoID = this.props.repoID;
    const showRepoInfoBar = this.props.path === '/' && (
      this.props.usedRepoTags.length != 0 || this.props.readmeMarkdown != null ||
      this.props.draftCounts != 0 || this.props.reviewCounts != 0);
    return (
      <Fragment>
        {showRepoInfoBar && (
          <RepoInfoBar
            repoID={repoID}
            currentPath={this.props.path}
            usedRepoTags={this.props.usedRepoTags}
            readmeMarkdown={this.props.readmeMarkdown}
            draftCounts={this.props.draftCounts}
            reviewCounts={this.props.reviewCounts}
            updateUsedRepoTags={this.props.updateUsedRepoTags}
          />
        )}
        <DirentListView
          path={this.props.path}
          repoID={repoID}
          repoEncrypted={this.props.repoEncrypted}
          isRepoOwner={this.props.isRepoOwner}
          isAdmin={this.props.isAdmin}
          isGroupOwnedRepo={this.props.isGroupOwnedRepo}
          enableDirPrivateShare={this.props.enableDirPrivateShare}
          direntList={this.props.direntList}
          sortBy={this.props.sortBy}
          sortOrder={this.props.sortOrder}
          sortItems={this.props.sortItems}
          onAddFile={this.props.onAddFile}
          onItemClick={this.onItemClick}
          onItemDelete={this.props.onItemDelete}
          onItemRename={this.props.onItemRename}
          onItemMove={this.props.onItemMove}
          onItemCopy={this.props.onItemCopy}
          onDirentClick={this.onDirentClick}
          onItemDetails={this.onItemDetails}
          isDirentListLoading={this.props.isDirentListLoading}
          updateDirent={this.props.updateDirent}
          currentRepoInfo={this.props.currentRepoInfo}
          isAllItemSelected={this.props.isAllDirentSelected}
          onAllItemSelected={this.props.onAllDirentSelected}
          onItemSelected={this.props.onItemSelected}
        />
      </Fragment>
    );
  }

  renderGridView = () => {
    // todo
    return (
      <div>grid-mode</div>
    )
  }

  renderColumnView = () => {
    return (
      this.renderListView()
    )
  }

  render() {
    let repoID = this.props.repoID;
    const errMessage = (<div className="message err-tip">{gettext('Folder does not exist.')}</div>);
    return (
      <div className={`main-panel o-hidden ${this.props.currentMode === 'column' ? 'dir-main-content' : ''}`}>
        <div className="main-panel-north border-left-show">
          <div className="cur-view-toolbar">
            <span className="sf2-icon-menu hidden-md-up d-md-none side-nav-toggle" title={gettext('Side Nav Menu')} onClick={this.onSideNavMenuClick}></span>
            <div className="dir-operation">
              {this.props.isDirentSelected ?
                <MutipleDirOperationToolbar
                  repoID={repoID} 
                  path={this.props.path}
                  selectedDirentList={this.props.selectedDirentList}
                  onItemsMove={this.props.onItemsMove}
                  onItemsCopy={this.props.onItemsCopy}
                  onItemsDelete={this.props.onItemsDelete}
                /> :
                <DirOperationToolBar 
                  path={this.props.path}
                  repoID={repoID}
                  repoName={this.props.repoName}
                  repoEncrypted={this.props.repoEncrypted}
                  direntList={this.props.direntList}
                  showShareBtn={this.props.showShareBtn}
                  enableDirPrivateShare={this.props.enableDirPrivateShare}
                  userPerm={this.props.userPerm}
                  isAdmin={this.props.isAdmin}
                  isGroupOwnedRepo={this.props.isGroupOwnedRepo}
                  onAddFile={this.props.onAddFile}
                  onAddFolder={this.props.onAddFolder}
                  onUploadFile={this.onUploadFile}
                  onUploadFolder={this.onUploadFolder}
                />
              }
            </div>
            <ViewModeToolbar currentMode={this.props.currentMode} switchViewMode={this.switchViewMode}/>
          </div>
          <CommonToolbar repoID={repoID} onSearchedClick={this.props.onSearchedClick} searchPlaceholder={gettext('Search files in this library')}/>
        </div>
        <div className="main-panel-center flex-row">
          <div className="cur-view-container">
            <div className="cur-view-path">
              {this.props.currentRepoInfo && (
                <CurDirPath 
                  repoID={repoID}
                  repoName={this.props.currentRepoInfo.repo_name}
                  pathPrefix={this.props.pathPrefix}
                  currentPath={this.props.path} 
                  permission={this.props.repoPermission} 
                  onPathClick={this.props.onMainNavBarClick}
                  onTabNavClick={this.props.onTabNavClick}
                />
              )}
            </div>
            <div className="cur-view-content">
              {!this.props.pathExist && errMessage }
              {(this.props.pathExist && (
                <Fragment>
                  {this.props.currentMode === 'list' && this.renderListView()}
                  {this.props.currentMode === 'grid' && this.renderGridView()}
                  {this.props.currentMode === 'column' && this.renderColumnView()}
                  <FileUploader
                    ref={uploader => this.uploader = uploader}
                    dragAndDrop={true}
                    path={this.props.path}
                    repoID={repoID}
                    direntList={this.props.direntList}
                    onFileUploadSuccess={this.onFileUploadSuccess}
                  />
                </Fragment>
              ))}
            </div>
          </div>
          {this.state.isDirentDetailShow && (
            <div className="cur-view-detail">
              <DirentDetail
                repoID={repoID}
                path={this.props.path}
                dirent={this.state.currentDirent}
                direntPath={this.state.direntPath}
                onItemDetailsClose={this.onItemDetailsClose}
                onFileTagChanged={this.props.onFileTagChanged}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

LibContentMain.propTypes = propTypes;

export default LibContentMain;
