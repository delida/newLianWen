pragma solidity ^0.4.13;
//pragma experimental ABIEncoderV2;


//MicroChain definition for application.
contract DeChatManagement {
    enum BoardStatus {noState, working, hiding}
    
	struct BoardInfo {
        address subchainAddr;
        bytes32 boardName;
        bytes32 picPath;
        uint boardStatus;
    }
    
    BoardInfo[] public boardList;
    address internal owner;
    
	function DeChatManagement() public payable {
		owner = msg.sender;
	}
	
	function creatBoard(address subchainAddr, bytes32 boardName, bytes32 picPath) public {
	    require(owner == msg.sender);
        boardList.push(BoardInfo(subchainAddr, boardName, picPath, uint(BoardStatus.working)));
    }
    
    function getBoardlist(uint status) public constant returns (address[] , bytes32[] , bytes32[] , uint[] ) {
        uint i;
        uint j = 0;
        for (i = 0; i < boardList.length; i++) {
            if(boardList[i].boardStatus == status) {
                j++;
            }
        }
        
        address[] memory subchainAddrlist = new address[](j);
        bytes32[] memory boardNamelist = new bytes32[](j);
        bytes32[] memory picPathlist = new bytes32[](j);
        uint[] memory boardStatuslist = new uint[](j);
        j = 0;
        for (i = 0; i < boardList.length; i++) {
            if(boardList[i].boardStatus == status) {
                subchainAddrlist[j] = boardList[i].subchainAddr;
                boardNamelist[j] = boardList[i].boardName;
                picPathlist[j] = boardList[i].picPath;
                boardStatuslist[j] = boardList[i].boardStatus;
                j++;
            }
        }
        return (subchainAddrlist, boardNamelist, picPathlist, boardStatuslist);
    }
    
    function updateBoardStatus(uint status, address subchainAddr) public {
        require(owner == msg.sender);
        
        uint i;
        for (i = 0; i < boardList.length; i++) {
            if(boardList[i].subchainAddr == subchainAddr) {
                boardList[i].boardStatus = status;
                break;
            }
        }
    }
}