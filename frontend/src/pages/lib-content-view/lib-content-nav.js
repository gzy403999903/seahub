import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { gettext } from '../../utils/constants';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import TreeView from '../../components/tree-view/tree-view';
import Loading from '../../components/loading';
import ModalPortal from '../../components/modal-portal';
import Delete from '../../components/dialog/delete-dialog';
import Rename from '../../components/dialog/rename-dialog';
import CreateFolder from '../../components/dialog/create-folder-dialog';
import CreateFile from '../../components/dialog/create-file-dialog';

const propTypes = {
  repoPermission: PropTypes.bool.isRequired,
  currentPath: PropTypes.string,
  currentRepoInfo: PropTypes.object,  // Initially not loaded
  isTreeDataLoading: PropTypes.bool.isRequired,
  treeData: PropTypes.object.isRequired,
  onNodeClick: PropTypes.func.isRequired,
  onNodeCollapse: PropTypes.func.isRequired,
  onNodeExpanded: PropTypes.func.isRequired,
  onRenameNode: PropTypes.func.isRequired,
  onDeleteNode: PropTypes.func.isRequired,
  onAddFileNode: PropTypes.func.isRequired,
  onAddFolderNode: PropTypes.func.isRequired,
};

class LibContentNav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      opNode: null,
      isLoadFailed: false,
      isMenuIconShow: false,
      isHeaderMenuShow: false,
      isHeaderMenuFreezed: false,
      isDeleteDialogShow: false,
      isAddFileDialogShow: false,
      isAddFolderDialogShow: false,
      isRenameDialogShow: false,
    };
    this.isNodeMenuShow = true;
  }

  onDropdownToggleClick = (e) => {
    e.preventDefault();
    this.toggleOperationMenu();
  }

  toggleOperationMenu = () => {
    this.setState({isHeaderMenuShow: !this.state.isHeaderMenuShow});
  }

  onNodeClick = (node) => {
    this.setState({opNode: node});
    this.props.onNodeClick(node);
  }

  onMenuItemClick = (operation, node) => {
    this.setState({opNode: node});
    switch (operation) {
      case 'New Folder':
        this.onAddFolderToggle();
        break;
      case 'New File':
        this.onAddFileToggle();
        break;
      case 'Rename':
        this.onRenameToggle();
        break;
      case 'Delete':
        this.onDeleteToggle();
        break;
    }
  }

  onAddFileToggle = (type) => {
    if (type === 'root') {
      let root = this.props.treeData.root;
      this.setState({
        isAddFileDialogShow: !this.state.isAddFileDialogShow,
        opNode: root,
      });
    } else {
      this.setState({isAddFileDialogShow: !this.state.isAddFileDialogShow});
    }
  }
  
  onAddFolderToggle = (type) => {
    if (type === 'root') {
      let root = this.props.treeData.root;
      this.setState({
        isAddFolderDialogShow: !this.state.isAddFolderDialogShow,
        opNode: root,
      });
    } else {
      this.setState({isAddFolderDialogShow: !this.state.isAddFolderDialogShow});
    }
  }

  onRenameToggle = () => {
    this.setState({isRenameDialogShow: !this.state.isRenameDialogShow});
  }

  onDeleteToggle = () => {
    this.setState({isDeleteDialogShow: !this.state.isDeleteDialogShow});
  }

  onAddFolderNode = (dirPath) => {
    this.setState({isAddFolderDialogShow: !this.state.isAddFolderDialogShow});
    this.props.onAddFolderNode(dirPath);
  }

  onAddFileNode = (filePath, isDraft) => {
    this.setState({isAddFileDialogShow: !this.state.isAddFileDialogShow});
    this.props.onAddFileNode(filePath, isDraft);
  }

  onRenameNode = (newName) => {
    this.setState({isRenameDialogShow: !this.state.isRenameDialogShow});
    let node = this.state.opNode;
    this.props.onRenameNode(node, newName);
  }

  onDeleteNode = () => {
    this.setState({isDeleteDialogShow: !this.state.isDeleteDialogShow});
    let node = this.state.opNode;
    this.props.onDeleteNode(node);
  }

  checkDuplicatedName = (newName) => {
    let node = this.state.opNode;
    // root node to new node conditions: parentNode is null, 
    let parentNode = node.parentNode ? node.parentNode : node;
    let childrenObject = parentNode.children.map(item => {
      return item.object;
    });
    let isDuplicated = childrenObject.some(object => {
      return object.name === newName;
    });
    return isDuplicated;
  }

  render() {
    return (
      <Fragment>
        <div id="side-nav" className="dir-side-nav" role="navigation">
          <div className="dir-nav-heading border-left-show" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            <div className="heading-title">{gettext('Files')}</div>
            <div className="heading-icon">
              {(this.props.repoPermission) && (
                <Dropdown isOpen={this.state.isHeaderMenuShow} toggle={this.toggleOperationMenu}>
                  <DropdownToggle 
                    tag="span" 
                    className="action-icon sf2-icon-plus" 
                    title={gettext('More Operations')}
                    data-toggle="dropdown" 
                    aria-expanded={this.state.isHeaderMenuShow}
                    onClick={this.onDropdownToggleClick}
                  />
                  <DropdownMenu right>
                    <DropdownItem onClick={this.onAddFolderToggle.bind(this, 'root')}>{gettext('New Folder')}</DropdownItem>
                    <DropdownItem onClick={this.onAddFileToggle.bind(this, 'root')}>{gettext('New File')}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          </div>
          <div className="dir-nav-container">
            {this.props.isTreeDataLoading ? 
              (<Loading/>) :
              (<TreeView
                repoPermission={this.props.repoPermission}
                isNodeMenuShow={this.isNodeMenuShow}
                treeData={this.props.treeData}
                currentPath={this.props.currentPath}
                onNodeClick={this.onNodeClick}
                onNodeExpanded={this.props.onNodeExpanded}
                onNodeCollapse={this.props.onNodeCollapse}
                onMenuItemClick={this.onMenuItemClick}
                onFreezedItem={this.onFreezedItem}
                onUnFreezedItem={this.onUnFreezedItem}
              />)
            }
          </div>
        </div>
        {this.state.isAddFolderDialogShow && (
          <ModalPortal>
            <CreateFolder
              parentPath={this.state.opNode.path}
              onAddFolder={this.onAddFolderNode}
              checkDuplicatedName={this.checkDuplicatedName}
              addFolderCancel={this.onAddFolderToggle}
            />
          </ModalPortal>
        )}
        {this.state.isAddFileDialogShow && (
          <ModalPortal>
            <CreateFile
              parentPath={this.state.opNode.path}
              onAddFile={this.onAddFileNode}
              checkDuplicatedName={this.checkDuplicatedName}
              addFileCancel={this.onAddFileToggle}
            />
          </ModalPortal>
        )}
        {this.state.isRenameDialogShow && (
          <ModalPortal>
            <Rename
              currentNode={this.state.opNode}
              onRename={this.onRenameNode}
              checkDuplicatedName={this.checkDuplicatedName}
              toggleCancel={this.onRenameToggle}
            />
          </ModalPortal>
        )}
        {this.state.isDeleteDialogShow && (
          <ModalPortal>
            <Delete
              currentNode={this.state.opNode}
              handleSubmit={this.onDeleteNode}
              toggleCancel={this.onDeleteToggle}
            />
          </ModalPortal>
        )}
      </Fragment>
    );
  }
}

LibContentNav.propTypes = propTypes;

export default LibContentNav;