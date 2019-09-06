const LineAPI = require('./api');
const request = require('request');
const fs = require('fs');
const unirest = require('unirest');
const webp = require('webp-converter');
const path = require('path');
const rp = require('request-promise');
const config = require('./config');
const { Message, OpType, Location } = require('../curve-thrift/line_types');
//let exec = require('child_process').exec;

const myBot = ['key your mid'];
const admin = ['key your mid'];
const banList = [];//Banned list
var groupList = new Array();//Group list
var vx = {};var midnornama,pesane,kickhim;var waitMsg = "no";//DO NOT CHANGE THIS
const imgArr = ['png','jpg','jpeg','gif','bmp','webp'];//DO NOT CHANGE THIS
var komenTL = "AutoLike \nline://ti/p/~doninoob"; //Comment for timeline
var bcText = "輸入廣播文字";
var limitposts = '10'; //Output timeline post

function isAdminOrBot(param) {
    return myBot.includes(param);
}

function isAdmin(param) {
    return admin.includes(param);
}

function isBanned(banList, param) {
    return banList.includes(param);
}

function firstToUpperCase(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function isTGet(string,param){
	return string.includes(param);
}

function isImg(param) {
    return imgArr.includes(param);
}

function ambilKata(params, kata1, kata2){
    if(params.indexOf(kata1) === false) return false;
    if(params.indexOf(kata2) === false) return false;
    let start = params.indexOf(kata1) + kata1.length;
    let end = params.indexOf(kata2, start);
    let returns = params.substr(start, end - start);
    return returns;
}

class LINE extends LineAPI {
    constructor() {
        super();
		this.limitposts = limitposts; //Output timeline post
        this.receiverID = '';
        this.stateStatus = {
			lockcancel: 0,
			lockinvite: 0,
			lockjoin: 0,
			autojoin: 1, //0 = No, 1 = Yes
            lockupdategroup: 0, //0 =lockupdategroup off, 1 = on
            kick: 0, //1 = Yes, 0 = No
			mute: 0, //1 = Mute, 0 = Unmute
			protect: 0, //Protect Qr,Kicker
			qr: 0, //0 = Gk boleh, 1 = Boleh
			salam: 1 //1 = Yes, 0 = No
        }
                this.jphelp = "「 sᴇʟғʙᴏᴛ-ʙʏ:Cang 」\n\
\n\
🕵 Group 🕵\n\
\n\
🤖❂͜͡➣ maxkill 翻群:\n\
🤖❂͜͡➣ ginfo 群組信息：\n\
🤖❂͜͡➣ tagall Tag所有用戶：\n\
🤖❂͜͡➣ kill @ 踢出：\n\
🤖❂͜͡➣ gurl 群組邀請連結：\n\
🤖❂͜͡➣ ourl 開啟群組連結：\n\
🤖❂͜͡➣ curl 關閉群組連結：\n\
🤖❂͜͡➣ left 離開\n\
\n\
🕵 Self 🕵\n\
\n\
🤖❂͜͡➣ addcontact 添加好友\n\
🤖❂͜͡➣ adminutil 管理員相關功能\n\
🤖❂͜͡➣ grouputil 群組相關功能\n\
🤖❂͜͡➣ ban Ban人\n\
🤖❂͜͡➣ unban 解ban\n\
🤖❂͜͡➣ botcontact 關於機器人\n\
🤖❂͜͡➣ botleft 離開群組\n\
🤖❂͜͡➣ broadcast 廣播\n\
🤖❂͜͡➣ cekid\n\
🤖❂͜͡➣ kepo\n\
🤖❂͜͡➣ sendcontact\n\
🤖❂͜͡➣ msg 送信\n\
🤖❂͜͡➣ mute 關閉機器人功能\n\
🤖❂͜͡➣ unmute 開啟機器人功能\n\
🤖❂͜͡➣ myid 查詢MID\n\
🤖❂͜͡➣ refresh 重啟\n\
🤖❂͜͡➣ speed|sp|.sp 測速\n\
🤖❂͜͡➣ test 測試\n\
🤖❂͜͡➣ now 現在時間\n\
🤖❂͜͡➣ gift 禮物\n\
🤖❂͜͡➣ youtube\n\
\n\
ʙʏ: sᴇʟғʙᴏᴛ-ʙʏ:Cang";
        var that = this;

		this.sthelp = "「 sᴇʟғʙᴏᴛ-ʙʏ:Cang 」\n\
\n\
🕵 Setting 🕵\n\
\n\
🤖❂͜͡➣ setting\n\
🤖❂͜͡➣ autojoin on/off\n\
🤖❂͜͡➣ cancel on/off\n\
🤖❂͜͡➣ kick on/off\n\
🤖❂͜͡➣ protect on/off\n\
🤖❂͜͡➣ qr on/off\n\
🤖❂͜͡➣ salam on/off\n\
\n\
ʙʏ: sᴇʟғʙᴏᴛ-ʙʏ:Cang";
        var that = this;

		this.keyhelp = "「 sᴇʟғʙᴏᴛ-ʙʏ:cang 」\n\
\n\
🕵 Help 🕵\n\
\n\
🤖❂͜͡➣ help\n\
🤖❂͜͡➣ help jp\n\
🤖❂͜͡➣ help st\n\
\n\
🕵 Group 🕵\n\
\n\
🤖❂͜͡➣ ginfo 群組信息：\n\
🤖❂͜͡➣ tagall Tag所有用戶：\n\
🤖❂͜͡➣ cancel：\n\
🤖❂͜͡➣ gurl 群組邀請連結：\n\
🤖❂͜͡➣ ourl 開啟群組連結：\n\
🤖❂͜͡➣ curl 關閉群組連結：\n\
\n\
🕵 Self 🕵\n\
\n\
🤖❂͜͡➣ addcontact 添加好友\n\
🤖❂͜͡➣ adminutil 管理員相關功能\n\
🤖❂͜͡➣ grouputil 群組相關功能\n\
🤖❂͜͡➣ ban Ban人\n\
🤖❂͜͡➣ unban 解ban\n\
🤖❂͜͡➣ botcontact 關於機器人\n\
🤖❂͜͡➣ botleft 離開群組\n\
🤖❂͜͡➣ broadcast 廣播\n\
🤖❂͜͡➣ cekid\n\
🤖❂͜͡➣ kepo\n\
🤖❂͜͡➣ sendcontact\n\
🤖❂͜͡➣ msg 送信\n\
🤖❂͜͡➣ mute 關閉機器人功能\n\
🤖❂͜͡➣ unmute 開啟機器人功能\n\
🤖❂͜͡➣ myid 查詢MID\n\
🤖❂͜͡➣ refresh 重啟\n\
🤖❂͜͡➣ speed|sp|.sp 測速\n\
🤖❂͜͡➣ test 測試\n\
🤖❂͜͡➣ now 現在時間\n\
🤖❂͜͡➣ gift 禮物\n\
🤖❂͜͡➣ youtube\n\
\n\
ʙʏ: sᴇʟғʙᴏᴛ-ʙʏ:cang";
        var that = this;
    }

    getOprationType(operations) {
        for (let key in OpType) {
            if(operations.type == OpType[key]) {
                //if(key !== 'NOTIFIED_UPDATE_PROFILE') {
                    console.info(`[* ${operations.type} ] ${key} `);
                //}
            }
        }
    }

    poll(operation) {
        if(operation.type == 25 || operation.type == 26) {
            const txt = (operation.message.text !== '' && operation.message.text != null ) ? operation.message.text : '' ;
            let message = new Message(operation.message);
            this.receiverID = message.to = (operation.message.to === myBot[0]) ? operation.message.from_ : operation.message.to ;
            Object.assign(message,{ ct: operation.createdTime.toString() });
            if(waitMsg == "yes" && operation.message.from_ == vx[0] && this.stateStatus.mute != 1){
				this.textMessage(txt,message,message.text)
			}else if(this.stateStatus.mute != 1){this.textMessage(txt,message);
			}else if(txt == "unmute" && isAdminOrBot(operation.message.from_) && this.stateStatus.mute == 1){
			    this.stateStatus.mute = 0;
			    this._sendMessage(message,"命令已開啟！")
		    }else{console.info("muted");}
        }
		
		//if(operation.type == 2 || operation.type == 1 || operation.type == 53 || operation.type == 43 || operation.type == 41 || operation.type == 24 || operation.type == 15 || operation.type == 21){console.info(operation);}
		
		if(operation.type == 16 && this.stateStatus.salam == 1){//join group
			let halo = new Message();
			halo.to = operation.param1;
			halo.text = "嗨";
			this._client.sendMessage(0, halo);
		}
		
		if(operation.type == 17 && this.stateStatus.salam == 1 && isAdminOrBot(operation.param2)) {//ada yang join
		    let halobos = new Message();
			halobos.to = operation.param1;
			halobos.toType = 2;
			halobos.text = "歡迎加入";
			this._client.sendMessage(0, halobos);
		}else if(operation.type == 17 && this.stateStatus.salam == 1){//ada yang join
			let seq = new Message();
			seq.to = operation.param1;
			//halo.siapa = operation.param2;
			this.textMessage("0101",seq,operation.param2,1);
			//this._client.sendMessage(0, halo);
		}
		
		if(operation.type == 13 && this.stateStatus.lockinvite == 1) {
            if(!isAdminOrBot(operation.param2)) {
			this.cancelAll(operation.param1,[operation.param2]);
			this._cancel(operation.param1,[operation.param2]);
            this._kickMember(operation.param1,[operation.param2]);
             }

           }
		
		if(operation.type == 32 && this.stateStatus.lockcancel == 1) { //ada cancel
          // op1 = group nya
          // op2 = yang 'nge' cancel
          // op3 = yang 'di' cancel
          if(isAdminOrBot(operation.param3)) {
              this._invite(operation.param1,[operation.param3]);
          }
          if(!isAdminOrBot(operation.param2)) {
              this._kickMember(operation.param1,[operation.param2]);
            }

        }
		
		if(operation.type == 15 && isAdminOrBot(operation.param2)) {//ada yang leave
		    let babay = new Message();
			babay.to = operation.param1;
			babay.toType = 2;
			babay.text = "為什麼要離開我QAQ";
			this._invite(operation.param1,[operation.param2]);
			this._client.sendMessage(0, babay);
		}else if(operation.type == 15 && !isAdminOrBot(operation.param2)){
			let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0102",seq,operation.param2,1);
		}
		
		if(operation.type == 5 && this.stateStatus.salam == 1) {//someone adding me..
            let halo = new Message();
			halo.to = operation.param1;
			halo.text = "安安，此為自動回應 無須理會";
			this._client.sendMessage(0, halo);
        }
		
		if(operation.type == 11 && this.stateStatus.lockupdategroup == 1 && !isAdminOrBot(operation.param2)){//update group (open qr)
		    let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0103",seq,operation.param2,1);
		}else if(operation.type == 11 && this.stateStatus.lockupdategroup == 1 && !isAdminOrBot(operation.param2)){
			let seq = new Message();
			seq.to = operation.param1;
	     this.textMessage("0104",seq,operation.param2,1);
		}else if(operation.type == 11 && this.stateStatus.lockupdategroup == 0 && !isAdminOrBot(operation.param2)){
			let seq = new Message();
			seq.to = operation.param1;
	    this.textMessage("0103",seq,operation.param2,1);
		}

           if(operation.type == 11 && this.stateStatus.lockupdategroup == 1) { //ada update
           // op1 = group nya
           // op2 = yang 'nge' update
           if(!isAdminOrBot(operation.param2)) {
              this._kickMember(operation.param1,[operation.param2]);
             }

           }

        if(operation.type == 19 && !isAdminOrBot(operation.param2) && this.stateStatus.kick == 1) { //ada kick
            // op1 = group nya
            // op2 = yang 'nge' kick
            // op3 = yang 'di' kick
			let kasihtau = new Message();
			kasihtau.to = operation.param1;
            if(isAdminOrBot(operation.param3)) {
				this.textMessage("0105",kasihtau,operation.param3,1);
                this._inviteIntoGroup(operation.param1,operation.param3);
				kasihtau.text = "別踢機器人";
				this._client.sendMessage(0, kasihtau);
				var kickhim = 'yes';
            }else if(!isAdminOrBot(operation.param3)){
				this.textMessage("0106",kasihtau,operation.param3,1);
				if(!isAdminOrBot(operation.param2)){
					kasihtau.text = "檢測到強迫踢人！";
				    this._client.sendMessage(0, kasihtau);
				}
				if(this.stateStatus.protect == 1){
					var kickhim = 'yes';
				}
            } 
			if(kickhim=='yes'){
				if(!isAdminOrBot(operation.param2)){
				    this._kickMember(operation.param1,[operation.param2]);
				}var kickhim = 'no';
			}

        }
		
		if(operation.type == 11 && this.stateStatus.protect == 1){//update group (open qr)
		    let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0103",seq,operation.param2,1);
		}else if(operation.type == 11 && this.stateStatus.qr == 1){
			let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0104",seq,operation.param2,1);
		}else if(operation.type == 11 && this.stateStatus.qr == 0){
			let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0103",seq,operation.param2,1);
		}
		
		if(operation.type == 17 && this.stateStatus.lockjoin == 1) {
            if(!isAdminOrBot(operation.param2) || !isStaffOrBot(operation.param2)) {
            this._kickMember(operation.param1,[operation.param2]);
             }

           }

        if(operation.type == 13) { // diinvite
            if(this.stateStatus.autojoin == 1 || isAdminOrBot(operation.param2)) {
		let _this = this;
		setTimeout( function() {
		    return _this._acceptGroupInvitation(operation.param1);
		}, 3000 );
            } else {
            }
        }
        this.getOprationType(operation);
    }
	
	async cancelAll(gid) {
        let { listPendingInvite } = await this.searchGroup(gid);
        if(listPendingInvite.length > 0){
            this._cancel(gid,listPendingInvite);
        }
    }
	
	async aLike(){
		if(config.chanToken && config.doing == "no"){
			config.doing = "ya";
		    this._autoLike(config.chanToken,limitposts,komenTL);
		}
	}

    async searchGroup(gid) {
        let listPendingInvite = [];
        let thisgroup = await this._getGroups([gid]);
        if(thisgroup[0].invitee !== null) {
            listPendingInvite = thisgroup[0].invitee.map((key) => {
                return key.mid;
            });
        }
        let listMember = thisgroup[0].members.map((key) => {
            return { mid: key.mid, dn: key.displayName };
        });

        return { 
            listMember,
            listPendingInvite
        }
    }
	
	async matchPeople(param, nama) {//match name
	    for (var i = 0; i < param.length; i++) {
            let orangnya = await this._client.getContacts([param[i]]);
		    if(orangnya[0].displayName == nama){
			    return orangnya;
				break;
		    }
        }
	}
	
	async isInGroup(param, mid) {
		let { listMember } = await this.searchGroup(param);
	    for (var i = 0; i < listMember.length; i++) {
		    if(listMember[i].mid == mid){
			    return listMember[i].mid;
				break;
		    }
        }
	}
	
	async isItFriend(mid){
		let listFriends = await this._getAllContactIds();let friend = "no";
		for(var i = 0; i < listFriends.length; i++){
			if(listFriends[i] == mid){
				friend = "ya";break;
			}
		}
		return friend;
	}

	
	async searchRoom(rid) {
        let thisroom = await this._getRoom(rid);
        let listMemberr = thisroom.contacts.map((key) => {
            return { mid: key.mid, dn: key.displayName };
        });

        return { 
            listMemberr
        }
    }

    setState(seq,param) {
		if(param == 1){
			let isinya = "Setting\n";
			for (var k in this.stateStatus){
                if (typeof this.stateStatus[k] !== 'function') {
					if(this.stateStatus[k]==1){
						isinya += " "+firstToUpperCase(k)+" => on\n";
					}else{
						isinya += " "+firstToUpperCase(k)+" => off\n";
					}
                }
            }this._sendMessage(seq,isinya);
		}else{
        if(isAdminOrBot(seq.from_)){
            let [ actions , status ] = seq.text.split(' ');
            const action = actions.toLowerCase();
            const state = status.toLowerCase() == 'on' ? 1 : 0;
            this.stateStatus[action] = state;
			let isinya = "Setting\n";
			for (var k in this.stateStatus){
                if (typeof this.stateStatus[k] !== 'function') {
					if(this.stateStatus[k]==1){
						isinya += " "+firstToUpperCase(k)+" => on\n";
					}else{
						isinya += " "+firstToUpperCase(k)+" => off\n";
					}
                }
            }
//          this._sendMessage(seq,`Status: \n${JSON.stringify(this.stateStatus)}`);
			this._sendMessage(seq,isinya);
        } else {
            this._sendMessage(seq,``);
        }}
    }

    mention(listMember) {
        let mentionStrings = [''];
        let mid = [''];
        for (var i = 0; i < listMember.length; i++) {
            mentionStrings.push('@'+listMember[i].displayName+'\n');
            mid.push(listMember[i].mid);
        }
        let strings = mentionStrings.join('');
        let member = strings.split('@').slice(1);
        
        let tmp = 0;
        let memberStart = [];
        let mentionMember = member.map((v,k) => {
            let z = tmp += v.length + 1;
            let end = z - 1;
            memberStart.push(end);
            let mentionz = `{"S":"${(isNaN(memberStart[k - 1] + 1) ? 0 : memberStart[k - 1] + 1 ) }","E":"${end}","M":"${mid[k + 1]}"}`;
            return mentionz;
        })
        return {
            names: mentionStrings.slice(1),
            cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }
        }
    }
	
	async tagAlls(seq){
		let { listMember } = await this.searchGroup(seq.to);
			seq.text = "";
			let mentionMemberx = [];
            for (var i = 0; i < listMember.length; i++) {
				if(seq.text == null || typeof seq.text === "undefined" || !seq.text){
					let namanya = listMember[i].dn;
				    let midnya = listMember[i].mid;
				    seq.text += "@"+namanya+" \n\n";
                    let member = [namanya];
        
                    let tmp = 0;
                    let mentionMember1 = member.map((v,k) => {
                        let z = tmp += v.length + 3;
                        let end = z;
                        let mentionz = `{"S":"0","E":"${end}","M":"${midnya}"}`;
                        return mentionz;
                    })
					mentionMemberx.push(mentionMember1);
				    const tag = {cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }}
				    seq.contentMetadata = tag.cmddata;
				    this._client.sendMessage(0, seq);
				}else{
				    let namanya = listMember[i].dn;
				    let midnya = listMember[i].mid;
					let kata = seq.text.split("");
					let panjang = kata.length;
				    seq.text += "@"+namanya+" \n\n";
                    let member = [namanya];
        
                    let tmp = 0;
                    let mentionMember = member.map((v,k) => {
                        let z = tmp += v.length + 3;
                        let end = z + panjang;
                        let mentionz = `{"S":"${panjang}","E":"${end}","M":"${midnya}"}`;
                        return mentionz;
                    })
					mentionMemberx.push(mentionMember);
				}
			}
			const tag = {cmddata: { MENTION: `{"MENTIONEES":[${mentionMemberx}]}` }}
			seq.contentMetadata = tag.cmddata;
			this._client.sendMessage(0, seq);
	}
	
	mension(listMember) {
        let mentionStrings = [''];
        let mid = [''];
        mentionStrings.push('@'+listMember.displayName+'\n\n');
        mid.push(listMember.mid);
        let strings = mentionStrings.join('');
        let member = strings.split('@').slice(1);
        
        let tmp = 0;
        let memberStart = [];
        let mentionMember = member.map((v,k) => {
            let z = tmp += v.length + 1;
            let end = z - 1;
            memberStart.push(end);
            let mentionz = `{"S":"${(isNaN(memberStart[k - 1] + 1) ? 0 : memberStart[k - 1] + 1 ) }","E":"${end}","M":"${mid[k + 1]}"}`;
            return mentionz;
        })
        return {
            names: mentionStrings.slice(1),
            cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }
        }
    }
	
	async leftGroupByName(payload) {
        let groupID = await this._getGroupsJoined();
	    for(var i = 0; i < groupID.length; i++){
		    let groups = await this._getGroups(groupID);
            for(var ix = 0; ix < groups.length; ix++){
                if(groups[ix].name == payload){
                    this._client.leaveGroup(0,groups[ix].id);
				    break;
                }
            }
	    }
    }

    async textMessage(textMessages, seq, param, lockt) {
        const [ cmd, payload ] = textMessages.split(' ');
		const gTicket = textMessages.split('line://ti/g/');
		const linktxt = textMessages.split('http');
        const txt = textMessages.toLowerCase();
        const messageID = seq.id;
		const cot = txt.split('@');
		const com = txt.split(':');
		const cox = txt.split(' ');
		
		if(txt == 'creator') {
           this._sendMessage(seq, '作者：');
           seq.contentType=13;
           seq.contentMetadata = { mid: 'ub7bc6da6edce4f8a88ba50fc4432dda7' };
           this._client.sendMessage(1, seq);
        }
		
		if(vx[1] == "sendcontact" && seq.from_ == vx[0] && waitMsg == "yes"){
			let panjang = txt.split("");
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"# 取消");
			}else if(txt == "me"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				seq.text = "Me";seq.contentType = 13;
				seq.contentMetadata = { mid: seq.from_ };
				this._client.sendMessage(0, seq);
			}else if(cot[1]){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
				seq.text = "Me";seq.contentType = 13;
				seq.contentMetadata = { mid: pment };
				this._client.sendMessage(0, seq);
			}else if(vx[2] == "arg1" && panjang.length > 30 && panjang[0] == "u"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				seq.text = "Me";seq.contentType = 13;
				seq.contentMetadata = { mid: txt };
				this._client.sendMessage(0, seq);
			}else{
			}
		}
		if(txt == "sendcontact" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;vx[2] = "arg1";
			    this._sendMessage(seq,"請指定您想查看的人\n#cancel/me/mention");
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#取消");
			}
		}

		
		if(vx[1] == "addcontact" && seq.from_ == vx[0] && waitMsg == "yes" && isAdminOrBot(seq.from_)){
			let panjang = txt.split("");
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"# 取消");
			}else if(seq.contentType == 13){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let midnya = seq.contentMetadata.mid;
				let listContacts = await this._client.getAllContactIds();
				for(var i = 0; i < listContacts.length; i++){
					if(listContacts[i] == midnya){
						vx[4] = "sudah";
						break;
					}
				}
				let bang = new Message();
				bang.to = seq.to;
				if(vx[4] == "sudah"){
					bang.text = "已加入！";
					this._client.sendMessage(0, bang);
				}else{
				    bang.text = "已經加入！";
				    await this._client.findAndAddContactsByMid(seq, midnya);
				    this._client.sendMessage(0, bang);
				}vx[4] = "";
			}else if(cot[1]){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;let midnya = pment;
				let listContacts = await this._client.getAllContactIds();
				for(var i = 0; i < listContacts.length; i++){
					if(listContacts[i] == midnya){
						vx[4] = "sudah";
						break;
					}
				}
				let bang = new Message();
				bang.to = seq.to;
				if(vx[4] == "sudah"){
					bang.text = "已加入";
					this._client.sendMessage(0, bang);
				}else{
				    bang.text = "已經加入！";
				    await this._client.findAndAddContactsByMid(seq, midnya);
				    this._client.sendMessage(0, bang);
				}vx[4] = "";
			}else if(vx[2] == "arg1" && panjang.length > 30 && panjang[0] == "u"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let midnya = txt;
				let listContacts = await this._client.getAllContactIds();
				for(var i = 0; i < listContacts.length; i++){
					if(listContacts[i] == midnya){
						vx[4] = "sudah";
						break;
					}
				}
				let bang = new Message();
				bang.to = seq.to;
				if(vx[4] == "sudah"){
					bang.text = "已在好友列表內";
					this._client.sendMessage(0, bang);
				}else{
				    bang.text = "已加入";
				    await this._client.findAndAddContactsByMid(seq, midnya);
				    this._client.sendMessage(0, bang);
				}vx[4] = "";
			}else{
				let bang = new Message();
				bang.to = seq.to;
				bang.text = "";
				this._client.sendMessage(0,bang);
			}
		}
		if(txt == "addcontact" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;vx[2] = "arg1";
			    this._sendMessage(seq,"指定您要添加朋友的人\n#contact/mention/mid\n\n「cancel」キャンセルできます");
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}
		
		if(vx[1] == "cekid" && seq.from_ == vx[0] && waitMsg == "yes"){
			let panjang = txt.split("");
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"# CANCELLED");
			}else if(seq.contentType == 13){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let midnya = seq.contentMetadata.mid;
				let bang = new Message();
				bang.to = seq.to;
				bang.text = midnya;
				this._client.sendMessage(0, bang);
			}else if(txt == "me"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				seq.text = seq.from_.toString();
				this._client.sendMessage(0, seq);
			}else if(cot[1]){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let cekid = new Message();
				cekid.to = seq.to;
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
				
				cekid.text = JSON.stringify(pment).replace(/"/g , "");
				this._client.sendMessage(0, cekid);
			}else{
				let bang = new Message();
				bang.to = seq.to;
				bang.text = "# 發送要查找的人ID或友資";
				this._client.sendMessage(0,bang);
			}
		}
		if(txt == "cekid" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;vx[2] = "arg1";
			    this._sendMessage(seq,"檢查誰的ID #發送友資");
				this._sendMessage(seq,"或是Tag");
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}
		
		if(vx[1] == "kepo" && seq.from_ == vx[0] && waitMsg == "yes" && isAdminOrBot(seq.from_)){
			let panjang = txt.split("");
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"# CANCELLED");
			}else if(seq.contentType == 13){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let midnya = seq.contentMetadata.mid;
				let timeline_post = await this._getHome(midnya,this.config.chanToken);
				let bang = new Message();
				bang.to = seq.to;
				
				let orangnya = await this._getContacts([midnya]);let vp,xvp;
				if(orangnya[0].videoProfile !== null && orangnya[0].videoProfile !== undefined){
					vp = orangnya[0].videoProfile.tids.mp4;
					xvp = "\n#影片檔案: \nhttp://dl.profile.line.naver.jp"+orangnya[0].picturePath+"/"+vp;
				}else{xvp='';}
				let ress = timeline_post.result;
				bang.text = 
"\n#名稱: "+orangnya[0].displayName+"\n\
\n#ID: \n"+orangnya[0].mid+"\n\
\n#檔案圖片: \nhttp://dl.profile.line.naver.jp"+orangnya[0].picturePath+"\n\
\n#背景圖片: \nhttp://dl.profile.line-cdn.net/myhome/c/download.nhn?userid="+orangnya[0].mid+"&oid="+ress.homeInfo.objectId+"\n\
"+xvp+"\n\
\n#狀態: \n"+orangnya[0].statusMessage+"\n\
\n\n\n \n\
====================\n\
              #Kepo \n\
====================";
				this._client.sendMessage(0,bang);
			}else if(cot[1]){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				let bang = new Message();
				bang.to = seq.to;
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
				let timeline_post = await this._getHome(pment,this.config.chanToken);
				
				let orangnya = await this._getContacts([pment]);let vp,xvp;
				if(orangnya[0].videoProfile !== null && orangnya[0].videoProfile !== undefined){
					vp = orangnya[0].videoProfile.tids.mp4;
					xvp = "\n#影片檔案: \nhttp://dl.profile.line.naver.jp"+orangnya[0].picturePath+"/"+vp;
				}else{xvp='';}
				let ress = timeline_post.result;
				bang.text = 
"\n#名稱: "+orangnya[0].displayName+"\n\
\n#ID: \n"+orangnya[0].mid+"\n\
\n#檔案圖片: \nhttp://dl.profile.line.naver.jp"+orangnya[0].picturePath+"\n\
\n#背景圖片: \nhttp://dl.profile.line-cdn.net/myhome/c/download.nhn?userid="+orangnya[0].mid+"&oid="+ress.homeInfo.objectId+"\n\
"+xvp+"\n\
\n#狀態: \n"+orangnya[0].statusMessage+"\n\
\n\n\n \n\
====================\n\
              #Kepo \n\
====================";
				this._client.sendMessage(0,bang);
			}else if(vx[2] == "arg1" && panjang.length > 30 && panjang[0] == "u"){
				let timeline_post = await this._getHome(txt,this.config.chanToken);
				let orangnya = await this._getContacts([txt]);let vp,xvp;
				if(orangnya[0].videoProfile !== null && orangnya[0].videoProfile !== undefined){
					vp = orangnya[0].videoProfile.tids.mp4;
					xvp = "\n#影片檔案: \nhttp://dl.profile.line.naver.jp"+orangnya[0].picturePath+"/"+vp;
				}else{xvp='';}
				let ress = timeline_post.result;
				seq.text = 
"\n#名稱: \n"+orangnya[0].displayName+"\n\
\n#ID: \n"+orangnya[0].mid+"\n\
\n#檔案圖片: \nhttp://dl.profile.line.naver.jp"+orangnya[0].picturePath+"\n\
\n#背景圖片: \nhttp://dl.profile.line-cdn.net/myhome/c/download.nhn?userid="+orangnya[0].mid+"&oid="+ress.homeInfo.objectId+"\n\
"+xvp+"\n\
\n#狀態: \n"+orangnya[0].statusMessage+"\n\
\n\n\n \n\
====================\n\
              #Kepo \n\
====================";
vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,seq.text);
			}else{
				let bang = new Message();
				bang.to = seq.to;
				this._client.sendMessage(0,bang);
			}
		}
		if(txt == "kepo" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;vx[2] = "arg1";
			    this._sendMessage(seq,"發送搜索的人 #contact/mention/mid/cancel");
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}
		
		if(vx[1] == "msg" && seq.from_ == vx[0] && waitMsg == "yes"){
			//vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
			let panjang = txt.split("");
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(vx[2] == "arg1" && vx[3] == "mid" && cot[1]){
				let bang = new Message();bang.to = seq.to;
				bang.text = "指名完了！\n請發送"
				this._client.sendMessage(0,bang);
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
				let midnya = JSON.stringify(pment);
				vx[4] = midnya;
				vx[2] = "arg2";
			}else if(vx[2] == "arg1" && vx[3] == "mid" && seq.contentType == 13){
				let midnya = seq.contentMetadata.mid;let bang = new Message();bang.to = seq.to;
				bang.text = "指名完了！\n請發送"
				this._client.sendMessage(0,bang);
				vx[4] = midnya;
				vx[2] = "arg2";
			}else if(vx[2] == "arg1" && vx[3] == "mid" && panjang.length > 30){
				this._sendMessage(seq,"OK !, 順邊說說近況 ?");
				vx[4] = txt;
				vx[2] = "arg2";
			}else if(vx[2] == "arg2" && vx[3] == "mid"){
				let panjangs = vx[4].split("");
				let kirim = new Message();let bang = new Message();
				bang.to = seq.to;
				if(panjangs[0] == "u"){
					kirim.toType = 0;
				}else if(panjangs[0] == "c"){
					kirim.toType = 2;
				}else if(panjangs[0] == "r"){
					kirim.toType = 1;
				}else{
					kirim.toType = 0;
				}
				bang.text = "送信完了！";
				kirim.to = vx[4];
				kirim.text = txt;
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";vx[4] = "";
				this._client.sendMessage(0, kirim);
				this._client.sendMessage(0, bang);
			}else{
				let bang = new Message();
				bang.to = seq.to;
				bang.text = "請發送一則訊息 #contact/mention/mid\n\n「cancel」";
				this._client.sendMessage(0,bang);
			}
		}if(txt == "msg" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;vx[3] = "mid";
			    this._sendMessage(seq,"Mau kirim pesan ke siapa bang ?");
				this._sendMessage(seq,"請發送一則訊息 #contact/mention/mid\n\n「cancel」");
				vx[2] = "arg1";
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}
		
		if(vx[1] == "ban" && seq.from_ == vx[0] && waitMsg == "yes"){
			let panjang = txt.split("");
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(cot[1]){
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
				let msg = new Message();msg.to = seq.to;
				if(isBanned(banList,pment)){
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					msg.text = cot[1]+"已添加";
					this._client.sendMessage(0,msg);
				}else{
					msg.text = "追加完了！";
					this._client.sendMessage(0, msg);
			        banList.push(pment);
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				}
			}else if(seq.contentType == 13){
				let midnya = seq.contentMetadata.mid;let msg = new Message();msg.to = seq.to;
				if(isBanned(banList,midnya)){
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					msg.text = "已添加";
					this._client.sendMessage(0, msg);
				}else{
					msg.text = "追加完了！";
					this._client.sendMessage(0, msg);
			        banList.push(midnya);
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				}
			}else if(panjang.length > 30 && panjang[0] == "u"){
				if(isBanned(banList,txt)){
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					this._sendMessage(seq,"已添加");
				}else{
					let msg = new Message();msg.to = seq.to;msg.text = "追加完了！";
					this._client.sendMessage(0, msg);
			        banList.push(txt);
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				}
			}else{
			}
		}
		if(txt == "ban" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;
			    this._sendMessage(seq,"將用戶添加到黑名單");
				vx[2] = "arg1";
				this._sendMessage(seq,"請指定\n#contact/mention/mid\n\n「cancel」");
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}
		
		if(vx[1] == "adminutil" && seq.from_ == vx[0] && waitMsg == "yes"){
			let panjang = txt.split("");
			let M = new Message();M.to = seq.to;
			let xtxt = "";
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(vx[2] == "arg1"){
				switch(txt){
					case 'add':
					    vx[2] = "arg2";vx[3] = txt;
					    this._sendMessage(seq,"請指定\n#contact/mention/mid\n\n「cancel」");
					break;
					case 'del':
					    vx[2] = "arg2";vx[3] = txt;xtxt = "「 Admin List 」\n\n";
					    await this._sendMessage(seq,"請選擇編號 即可移除");
						for(var i=0; i < myBot.length; i++){
							let numb = i+1;
							let xcontact = await this._client.getContact(myBot[i]);
							xtxt += numb+"). "+xcontact.displayName+"\n";
						}
						M.text = xtxt;
						this._client.sendMessage(0, M);
					break;
					case 'list':
					    vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
						for(var i=0; i < myBot.length; i++){
							let numb = i+1;
							let xcontact = await this._client.getContact(myBot[i]);
							xtxt += numb+"). "+xcontact.displayName+"\n";
						}
						M.text = xtxt;
						this._client.sendMessage(0, M);
					break;
					case 'cancel':
					    vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
						this._sendMessage(seq,"#CANCELLED");
					break;
				}
			}else if(vx[2] == "arg2" && vx[3] == "add"){
				if(cot[1]){
					let ment = seq.contentMetadata.MENTION;
				    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
					let msg = new Message();msg.to = seq.to;
					if(isAdminOrBot(pment)){
						waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
						msg.text = cot[1]+"已添加！";
						this._client.sendMessage(0,msg);
					}else{
						msg.text = "Done !";
						this._client.sendMessage(0, msg);
				        myBot.push(pment);
						waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					}
				}else if(seq.contentType == 13){
					let midnya = seq.contentMetadata.mid;let msg = new Message();msg.to = seq.to;
					if(isAdminOrBot(midnya)){
						waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
						msg.text = "已添加！";
						this._client.sendMessage(0, msg);
					}else{
						msg.text = "追加完了！";
						this._client.sendMessage(0, msg);
				        myBot.push(midnya);
						waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					}
				}else if(panjang.length > 30 && panjang[0] == "u"){
					if(isAdminOrBot(txt)){
						waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
						this._sendMessage(seq,"已添加！");
					}else{
						let msg = new Message();msg.to = seq.to;msg.text = "追加完了！";
						this._client.sendMessage(0, msg);
				        myBot.push(txt);
						waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					}
				}
			}else if(vx[2] == "arg2" && vx[3] == "del"){
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				let ment = txt-1;
				if (ment > myBot.length) {
               	    myBot.splice(ment, 1);
					this._sendMessage(seq,"成功 !");
                }else{
					this._sendMessage(seq,"管理員不存在 !");
				}
			}
		}
		if(txt == "adminutil" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;
				vx[2] = "arg1";
				this._sendMessage(seq,"「 Admin権限管理 」\n\n- 権限追加 = add\n- 権限削除 = del\n- 権限者一覧 = list\n\n- 終了 = cancel");
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}
		
		
		if(vx[1] == "unban" && seq.from_ == vx[0] && waitMsg == "yes"){
			let panjang = txt.split("");
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(cot[1]){
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
				let bang = new Message();bang.to = seq.to;
				if(isBanned(banList, pment)){
					let ment = banList.indexOf(pment);
					if (ment > -1) {
                        banList.splice(ment, 1);
                    }
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					bang.text = "削除完了！";
					this._client.sendMessage(0,bang);
				}else{
					bang.text = "非黑單用戶";
					this._client.sendMessage(0, bang);
				}
			}else if(seq.contentType == 13){
				let midnya = seq.contentMetadata.mid;let bang = new Message();bang.to = seq.to;
				if(isBanned(banList, midnya)){
					let ment = banList.indexOf(midnya);
					if (ment > -1) {
                        banList.splice(ment, 1);
                    }
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					bang.text = "削除完了！";
					this._client.sendMessage(0,bang);
				}else{
					bang.text = "非黑單用戶";
					this._client.sendMessage(0, bang);
				}
			}else if(panjang.length > 30 && panjang[0] == "u"){
				let bang = new Message();bang.to = seq.to;
				if(isBanned(banList, txt)){
					let ment = banList.indexOf(txt);
					if (ment > -1) {
                        banList.splice(ment, 1);
                    }
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					bang.text = "削除完了！";
					this._client.sendMessage(0,bang);
				}else{
					this._sendMessage(seq,"非黑單用戶");
				}
			}else{
			}
		}
		if(txt == "unban" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;
				seq.text = "";
				for(var i = 0; i < banList.length; i++){
					let orangnya = await this._getContacts([banList[i]]);
				    seq.text += "\n-["+orangnya[0].mid+"]["+orangnya[0].displayName+"]";
				}
				this._sendMessage(seq,seq.text);
			    this._sendMessage(seq,"請指定刪除的人\n#contact/mention/mid\n\n「cancel」");
				vx[2] = "arg1";
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}
		
		if(txt == "banlist" && isAdminOrBot(seq.from_)){
			seq.text = "⇗黑名單⇙\n[Mid] [Name]\n\n";
			for(var i = 0; i < banList.length; i++){
			    let orangnya = await this._getContacts([banList[i]]);
				seq.text += "["+orangnya[0].mid+"]["+orangnya[0].displayName+"]\n";
			}
			this._sendMessage(seq,seq.text);
		}
		
		if(txt == "left" && isAdminOrBot(seq.from_)){
			this._client.leaveGroup(0,seq.to);
		}
		
		if(vx[1] == "youtube" && seq.from_ == vx[0] && waitMsg == "yes"){
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(vx[2] == "arg1" && linktxt[1]){
				vx[3] = '';vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";
				let dlUrl = "http"+linktxt[1];let tspl = textMessages.split("youtu.be/");
				if(tspl || typeof tspl !== "undefined"){
					dlUrl = "https://m.youtube.com/watch?v="+tspl[1];
				}
				let downloader = this.config.YT_DL;let hasil = '';
				let infDl = new Message();
				infDl.to = seq.to;
				var options = {
             	   uri: downloader,
             	   qs: {url: dlUrl},
            	   json: true // Automatically parses the JSON string in the response
            	};

            	await rp(options)
           	  	  .then(function (repos) {
           	          hasil = repos;
            	})
             	  .catch(function (err) {
           	    });
				if(hasil == "Error: no_media_found"){
			    	infDl.text = "失敗";
				}else{
					let title = hasil.title;
					let urls = hasil.urls;
					infDl.text = "[ Youtube Downloader ]\nTitle: "+title+"\n";
					for(var i = 0; i < urls.length; i++){
						let idU = await this.gooGl(urls[i].id);
						infDl.text += "\n\
Info: "+urls[i].label+"\n\
Link Download: "+idU.id+"\n";
					}
				}
				this._sendMessage(seq,infDl.text);
			} else {
			}
		}
		if(txt == "youtube" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
				waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;
			    this._sendMessage(seq,"發送Youtube連結\n# Link/cancel");
				vx[2] = "arg1";
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}
		
		if(vx[1] == "botleft" && seq.from_ == vx[0] && waitMsg == "yes"){
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(txt == "group" && vx[2] == "arg1"){
				vx[3] = txt;
				this._sendMessage(seq,"OK...?");
				vx[2] = "arg2";
			}else if(vx[3] == "group" && vx[2] == "arg2"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this.leftGroupByName(textMessages);
			}
		}
		if(txt == "botleft" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
				waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;
			    this._sendMessage(seq,"離開了 ? #group");
				vx[2] = "arg1";
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}
		
		if(txt == "mute" && isAdminOrBot(seq.from_)){
			this.stateStatus.mute = 1;
			this._sendMessage(seq,"已關閉命令\n※unmute解除")
		}

		if(vx[1] == "grouputil" && seq.from_ == vx[0] && waitMsg == "yes"){
			if(vx[2]=="arg1"){
			let M = new Message();
			let listGroups = await this._client.getGroupIdsJoined();
			let xtxt = "「 Group List 」\n\n";
			switch(txt){
				case 'list':
				    vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";groupList = [];
					M.to = seq.to;
					listGroups.forEach(function(item, index, array) {
					  groupList.push(item);
					});
					for(var i = 0; i < groupList.length; i++){
						let numb = i + 1;
						let groupInfo = await this._client.getGroup(groupList[i]);
						let gname = groupInfo.name;
						let memberCount = groupInfo.members.length;
						xtxt += numb+"). "+gname+" ("+memberCount+")\n";
					}
					M.text = xtxt;
					this._client.sendMessage(0, M);				
				break;
				case 'ticket':
				    vx[2] = "arg2";vx[3] = "ticket";M.to = seq.to;groupList = [];
					M.text = "選擇下面的組號！";
					await this._client.sendMessage(0, M);
					listGroups.forEach(function(item, index, array) {
					  groupList.push(item);
					});
					for(var i = 0; i < groupList.length; i++){
						let numb = i + 1;
						let groupInfo = await this._client.getGroup(groupList[i]);
						let gname = groupInfo.name;
						let memberCount = groupInfo.members.length;
						xtxt += numb+"). "+gname+" ("+memberCount+")\n";
					}
					M.text = xtxt;
					this._client.sendMessage(0, M);				
				break;
				case 'cancel':
				 vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				 this._sendMessage(seq,"#CANCELLED");
			}}else if(vx[2] == "arg2" && vx[3] == "ticket"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				if(typeof groupList[txt - 1] !== 'undefined') {
					let updateGroup = await this._getGroup(groupList[txt - 1]);
					if(updateGroup.preventJoinByTicket === true) {
					   updateGroup.preventJoinByTicket = false;
					   await this._updateGroup(updateGroup);
					}
					const groupUrl = await this._reissueGroupTicket(groupList[txt - 1]);
					this._sendMessage(seq,"Line Group -> line://ti/g/"+groupUrl);
				}else{this._sendMessage(seq,"找不到群組");}
			}
		}
		if(txt == "grouputil" && isAdminOrBot(seq.from_)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
				waitMsg = "yes";
			    vx[0] = seq.from_;vx[1] = txt;
			    this._sendMessage(seq,"「 Group Utility 」\n- Grouplist = list\n- Group Ticket = ticket\n");
				vx[2] = "arg1";
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}
		
		if(cox[0] == "broadcast" && isAdminOrBot(seq.from_) && cox[1]){
            let listMID = [];
            let bcText = textMessages.split(" ").slice(1).toString().replace(/,/g , " ");
            let bcm = new Message();
            bcm.toType = 0;
            let listContacts = await this._client.getAllContactIds();listMID.push(listContacts);
	        let listGroups = await this._client.getGroupIdsJoined();listMID.push(listGroups);
			for(var i = 0; i < listMID.length; i++){
		        for(var xi = 0; xi <listMID[i].length; xi++){
		        	bcm.to = listMID[i][xi];
                    let midc = listMID[i][xi].split("");
                    if(midc[0] == "u"){bcm.toType = 0;}else if(midc[0] == "c"){bcm.toType = 2;}else if(midc[0] == "r"){bcm.toType = 1;}else{bcm.toType = 0;}
                    bcm.text = bcText;
                    this._client.sendMessage(0, bcm);
	        	}
            }
	}
		
		if(txt == "refresh" && isAdminOrBot(seq.from_)){
			this._sendMessage(seq, "清除中....");
			await this._client.removeAllMessages();
			this._sendMessage(seq, "Done !");
		}
		
	const sp = ['sp','speed'];
        if(sp.includes(txt) && isAdminOrBot(seq.from_)) {
			const curTime = (Date.now() / 1000);let M = new Message();M.to=seq.to;M.text = '';M.contentType = 1;M.contentPreview = null;M.contentMetadata = null;
			await this._client.sendMessage(0,M);
			const rtime = (Date.now() / 1000);
            const xtime = rtime	- curTime;
            this._sendMessage(seq, xtime+' second');
        }else if(sp.includes(txt) && isAdminOrBot(seq.from_)){this._sendMessage(seq,"");}

	if(txt == '.sp' && isAdminOrBot(seq.from_)) {
	        const curTime = (Date.now() / 1000);
		await this._sendMessage(seq,'Already\nTaken %Sp\nDebug speed');
		const rtime = (Date.now() / 1000) - curTime;
		await this._sendMessage(seq, `${rtime} second`);
	}

	if(txt == 'gift' && isAdminOrBot(seq.from_)) {
		seq.contentType = 9
		seq.contentMetadata = {'PRDID': 'a0768339-c2d3-4189-9653-2909e9bb6f58','PRDTYPE': 'THEME','MSGTPL': '5'};
		this._client.sendMessage(1, seq);
	}

        /*if(txt === 'kernel') {
            exec('uname -a;ptime;id;whoami',(err, sto) => {
                this._sendMessage(seq, sto);
            })
        }*/

        if(txt === 'maxkill' && isAdminOrBot(seq.from_) && seq.toType == 2) {
            let { listMember } = await this.searchGroup(seq.to);
            for (var i = 0; i < listMember.length; i++) {
                if(!isAdminOrBot(listMember[i].mid)){
                    this._kickMember(seq.to,[listMember[i].mid])
                }
            }
	}
		
		if(txt == 'test' && isAdminOrBot(seq.from_)) {
			let botOwner = await this._client.getContacts([myBot[0]]);
            let { mid, displayName } = await this._client.getProfile();
			let key2 = "\n\
====================\n\
 BotName   : \n\
"+displayName+"\n\
 BotID     : \n\
["+mid+"]\n\
 BotStatus : \n\
動作中...\n\
 BotOwner  : \n\
 "+botOwner[0].displayName+"\n\
====================\n";
			seq.text = key2;
			this._client.sendMessage(0, seq);
		}

                if(txt == 'help st' && isAdminOrBot(seq.from_)) {
                        seq.text = this.sthelp;
                        this._client.sendMessage(0, seq);
		}
		if(txt == 'help jp' && isAdminOrBot(seq.from_)) {
			seq.text = this.jphelp;
			this._client.sendMessage(0, seq);
		}
		if(txt == 'help' && isAdminOrBot(seq.from_)) {
			seq.text = this.keyhelp;
			this._client.sendMessage(0, seq);
		}
		
		if(cmd == 'Kill'){
           let target = payload.replace('@','');
           let group = await this._getGroups([seq.to]);
           let gm = group[0].members;
              for(var i = 0; i < gm.length; i++){
                     if(gm[i].displayName == target){
                                  target = gm[i].mid;
                     }
               }

               this._kickMember(seq.to,[target]);
        }

		if(txt == '/spam' && isAdminOrBot(seq.from_)) {
			for (var i = 0; i < 100000; i++) {
				this._sendMessage(seq,'我不知道這是三小');
			}
		}
		
		if(txt == '0101' && lockt == 1) {//Jangan dicoba (gk ada efek)
            let { listMember } = await this.searchGroup(seq.to);
            for (var i = 0; i < listMember.length; i++) {
                if(listMember[i].mid==param){
					let namanya = listMember[i].dn;
					seq.text = '歡迎 @'+namanya+', 加入 ^_^';
					let midnya = listMember[i].mid;
					let kata = seq.text.split("@").slice(0,1);
					let kata2 = kata[0].split("");
					let panjang = kata2.length;
                    let member = [namanya];
        
                    let tmp = 0;
                    let mentionMember = member.map((v,k) => {
                        let z = tmp += v.length + 1;
                        let end = z + panjang;
                        let mentionz = `{"S":"${panjang}","E":"${end}","M":"${midnya}"}`;
                        return mentionz;
                    })
					const tag = {cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }}
					seq.contentMetadata = tag.cmddata;
					this._client.sendMessage(0, seq);
					//console.info("Salam");
                }
            }
        }
		
		if(txt == "tagall" && seq.toType == 2 && isAdminOrBot(seq.from_)){
			await this.tagAlls(seq);
		}
		
		if(txt == '0103' && lockt == 1){
			let ax = await this._client.getGroup(seq.to);
			if(ax.preventJoinByTicket === true){}else{ax.preventJoinByTicket = true;await this._client.updateGroup(0, ax);}
		}
		if(txt == '0104' && lockt == 1){
			let ax = await this._client.getGroup(seq.to);
			if(ax.preventJoinByTicket === true){ax.preventJoinByTicket = false;await this._client.updateGroup(0, ax);}else{}
		}
		
		if(txt == '0102' && lockt == 1) {//Jangan dicoba (gk ada efek)
            let { listMember } = await this.searchGroup(seq.to);
            for (var i = 0; i < listMember.length; i++) {
                if(listMember[i].mid==param){
					let namanya = listMember[i].dn;
					seq.text = 'Goodbye ! @'+namanya;
					let midnya = listMember[i].mid;
					let kata = seq.text.split("@").slice(0,1);
					let kata2 = kata[0].split("");
					let panjang = kata2.length;
                    let member = [namanya];
        
                    let tmp = 0;
                    let mentionMember = member.map((v,k) => {
                        let z = tmp += v.length + 1;
                        let end = z + panjang;
                        let mentionz = `{"S":"${panjang}","E":"${end}","M":"${midnya}"}`;
                        return mentionz;
                    })
					const tag = {cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }}
					seq.contentMetadata = tag.cmddata;
					this._client.sendMessage(0, seq);
					//console.info("Salam");
                }
            }
        }
		
		if(txt == 'botcontact' && isAdminOrBot(seq.from_)){
			let probot = await this._client.getProfile();
			let settings = await this._client.getSettings();
			let emailbot = settings.identityIdentifier;
			let M = new Message();M.to = seq.to;
			M.text = 'Bot Name: '+probot.displayName+'\nBot LineId: line://ti/p/'+probot.userid+'\nBot Url: http://line.me/ti/p/'+settings.contactMyTicket+'';
			this._client.sendMessage(0,M);
		}
		
		if(cox[0] == "album" && isAdminOrBot(seq.from_)){
			await this._createAlbum(seq.to,cox[1],this.config.chanToken);
		}
		
		if(txt == "setting" && isAdminOrBot(seq.from_)){
			this.setState(seq,1)
		}
		
        const action = ['autojoin on','autojoin off','lockupdategroup on','lockupdategroup off','kick on','kick off','salam on','salam off','protect off','protect on','qr on','qr off','lockcancel on','lockcancel off','lockinvite on','lockinvite off','lockjoin on','lockjoin off']
        if(action.includes(txt)) {
            this.setState(seq,0)
        }
	
        if(txt == 'myid' && isAdminOrBot(seq.from_)) {
            this._sendMessage(seq,seq.from_);
        }
		
		if(txt == "now" && isAdminOrBot(seq.from_)){
			let d = new Date();let xmenit = d.getMinutes().toString().split("");
			if(xmenit.length < 2){
				this._sendMessage(seq, d.getHours()+"時0"+d.getMinutes()+"分");
			}else{
				this._sendMessage(seq, d.getHours()+"時"+d.getMinutes()+"分");
			}
		}

		if(txt == 'ginfo' && isAdminOrBot(seq.from_)) {
            let groupInfo = await this._client.getGroup(seq.to);let gqr = 'open';let ticketg = 'line://ti/g/';
			let createdT64 = groupInfo.createdTime.toString().split(" ");
			let createdTime = await this._getServerTime(createdT64[0]);
			let gid = seq.to;
			let gticket = groupInfo.groupPreference.invitationTicket;
			if(!gticket){ticketg = "CLOSED";}else{ticketg += gticket;}
			let gname = groupInfo.name;
			let memberCount = groupInfo.members.length;
			let gcreator = groupInfo.creator.displayName;
			let pendingCount = 0;
			if(groupInfo.invitee !== null){
				//console.info("pendingExist");
				pendingCount = groupInfo.invitee.length;
			}
			let gcover = groupInfo.pictureStatus;
			let qr = groupInfo.preventJoinByTicket;
			if(qr === true){
				gqr = 'close';
			}
			let bang = new Message();
			bang.to = seq.to;
			
			bang.text = "# Group Name:\n"+gname+"\n\
\n# Group ID:\n"+gid+"\n\
\n# Group Creator:\n"+gcreator+"\n\
\n# Group CreatedTime:\n"+createdTime+"\n\
\n# Group Url:\n"+ticketg+"\n\
\n# メンバー: "+memberCount+"\n\
\n# 招待中: "+pendingCount+"\n\
\n# QR: "+gqr+"\n\
\n# Group Cover:\nhttp://dl.profile.line.naver.jp/"+gcover;
            this._client.sendMessage(0,bang);
	}

        const joinByUrl = ['gurl','curl','ourl'];
        if(joinByUrl.includes(txt) && txt == "gurl" && isAdminOrBot(seq.from_)) {
            this._sendMessage(seq,`リンク/QRコード更新後、それを使用したグループ招待を許可します…`);
            let updateGroup = await this._getGroup(seq.to);//console.info(updateGroup);
            if(updateGroup.preventJoinByTicket === true) {
                updateGroup.preventJoinByTicket = false;
				await this._updateGroup(updateGroup);
				seq.text = "已允許";
	    }else{seq.text = "已經被允許了！";}
	    this._sendMessage(seq,seq.text);
			const groupUrl = await this._reissueGroupTicket(seq.to)
            this._sendMessage(seq,`line://ti/g/${groupUrl}`);
        }else if(joinByUrl.includes(txt) && txt == "curl" && isAdminOrBot(seq.from_)) {
            this._sendMessage(seq,`リンク/QRコードを使用したグループ招待をブロックします…`);
            let updateGroup = await this._getGroup(seq.to);//console.info(updateGroup);
            if(updateGroup.preventJoinByTicket === false) {
                updateGroup.preventJoinByTicket = true;
				await this._updateGroup(updateGroup);
				seq.text = "它已被封鎖！";
            }else{seq.text = "已被封鎖！";}
            this._sendMessage(seq,seq.text);
        }else if(joinByUrl.includes(txt) && txt == "ourl" && isAdminOrBot(seq.from_)) {
            this._sendMessage(seq,`リンク/QRコードを使用したグループ招待を許可します…`);
	    let updateGroup = await this._getGroup(seq.to);//console.info(updateGroup);
	    if(updateGroup.preventJoinByTicket === true) {
		updateGroup.preventJoinByTicket = false;
				await this._updateGroup(updateGroup);
				seq.text = "已允許";
	    }else{seq.text = "已經被允許了！";}
	    this._sendMessage(seq,seq.text);
	}
		
		if(txt == "0105" && lockt == 1){
			let aas = new Message();
			aas.to = param;
			let updateGroup = await this._getGroup(seq.to);
            if(updateGroup.preventJoinByTicket === true) {
                updateGroup.preventJoinByTicket = false;
				await this._updateGroup(updateGroup);
            }
			const groupUrl = await this._reissueGroupTicket(seq.to);
			aas.toType = 0;
			aas.text = `!joinline://ti/g/${groupUrl}`;
			this._client.sendMessage(0, aas);
		}
		
		if(txt == "0106" && lockt == 1){
			let friend = await this.isItFriend(param);
			if(friend == "no"){
				await this._client.findAndAddContactsByMid(0, param);
				this._client.inviteIntoGroup(0,seq.to,[param]);
			}else{this._client.inviteIntoGroup(0,seq.to,[param]);}
		}
		
		if(gTicket[0] == "!join" && isAdminOrBot(seq.from_)){
			let sudah = "no";
			let grp = await this._client.findGroupByTicket(gTicket[1]);
			let lGroup = await this._client.getGroupIdsJoined();
			for(var i = 0; i < lGroup.length; i++){
				if(grp.id == lGroup[i]){
					sudah = "ya";
				}
			}
			if(sudah == "ya"){
				let bang = new Message();bang.to = seq.to;bang.text = "加入失敗，已經加入群組內";
				this._client.sendMessage(0,bang);
			}else if(sudah == "no"){
				await this._acceptGroupInvitationByTicket(grp.id,gTicket[1]);
			}
		}



    }

}

module.exports = new LINE();
