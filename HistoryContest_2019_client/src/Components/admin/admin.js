import React from 'react';
import { Row, Col, Icon, Button, Modal, Layout,  Table, Descriptions, Input, Tag, message, Dropdown, Menu,Drawer } from 'antd';
import 'antd/dist/antd.css';
import mark from '../../img/校徽实体.png'

const { Header, Footer, Sider, Content } = Layout;
//const departInfo = require("./departTest.json")
class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            origionData: {},
            displayData: [],
            departData: [],
            departList:[],
            num: -1,
            depart: this.props.state.depart,
            average: -1,
            numOfDone: -1,
            rank:-1,
            searchText: '',
            loading: false,
            departVisible:false,
            register: {
                Visible: false,
                post: false,
                name: "",
                username: "",
                password: ""
            },
            reset: {
                Visible: false,
                post: false,
                name: "",
                username: "",
                password: "",
                attemp: ""
            },
            export: {
                loading:false
            }
        }
        this.get = this.get.bind(this);
        this.register = this.register.bind(this);
        this.reset = this.reset.bind(this);
        this.exportByExcel = this.exportByExcel.bind(this);
    }
    async exportByExcel() {
        // let headers = ["院系", "姓名", "学号", "一卡通", "成绩", "用时", "排名"];
        // let output = [];
        // this.setState({export:{loading:true}});
        // await Object.keys(this.state.origionData).forEach((inst, i) => {          
        //         let temp = [];
        //         this.state.origionData[inst].forEach((x) => {
        //             temp.push([inst, x.name, x.username, x.password, x.score, x.time_use, x.rank])
        //         })
        //         output.push({
        //             name: inst,
        //             data: temp
        //         });       
        // })
        // let result = xlsx.build(output);
        // fs.writeFile("D:\\1.xlsx",result,function(err){
        //     if(err){
        //         throw err;
        //     }
        //     else{
        //     console.log("success")
        //     }
        // });
        // this.setState({export:{loading:false}});
        // message.success("excel文件已导出")
    }
    async get() {
        let that = this;
        //测试院系数据
        // Object.keys(departInfo).map((inst,i)=>{
        //     departInfo[inst]["均分"]=90.00;
        // })
        fetch("http://"+that.props.state.host+"/api/admin/get_alldepartments",{
            methods: "GET",
            mode:"cors",
            headers: {
                "authorization": that.props.state.token,
                "Content-Type": "application/json"
            }
        }).then((res)=>{return res.json()}
        ).then((data)=>{
            data.Departments.map((inst,rank)=>{
                that.state.departData.push(new Object);
                that.state.departData[rank]={
                    "学院":inst.name,
                    "排名":rank+1,
                    "均分":inst.average
                }
                if(inst.name==that.props.state.depart){
                    that.state.average=inst.average;
                    that.state.numOfDone=inst.tested_number;
                    that.state.num=inst.total_number;
                    that.state.rank=rank+1;      
                }
            })
        })
        //测试学生数据
        // const testdata = await require("./Students.json");
        // const testdata2 = await require("./student.json");
        // let temp={};
        // temp["计算机科学与技术学院"]=[];
        // temp["吴健雄学院"]=[];
        // temp["建筑学院"]=[];
        // await testdata.forEach((x, i) => {
        //     temp["计算机科学与技术学院"].push({
        //         name: x.Name,
        //         username: x.ID,
        //         password: x.CardID,
        //         score: 90,
        //         time_use: 600
        //     })
        // })
        // await testdata2.forEach((x, i) => {
        //     temp["吴健雄学院"].push({
        //        name: x.Name,
        //         username: x.ID,
        //         password: x.CardID,
        //         score: 75,
        //         time_use: 900
        //     })
        // })
        // await testdata2.forEach((x, i) => {
        //    temp["建筑学院"].push({
        //         name: x.Name,
        //         username: x.ID,
        //         password: x.CardID,
        //         score: -1,
        //         time_use: 800

        //     })
        // })
        // let data=temp;
        // that.setState({loading:true});
        //  Object.keys(data).forEach((inst) => {
        //     if (data[inst] != []) {
        //         data[inst].sort((a, b) => { return b["成绩"] - a["成绩"] })
        //         data[inst].forEach((per, rank) => {
        //             per.rank = rank + 1;
        //         })
        //     }
        //     let i=0;
        //     data[inst].forEach((v) => {
        //         that.state.displayData.push({
        //             key:i   ,
        //             "学号": v.username,
        //             "姓名": v.name,
        //             "一卡通": v.password,
        //             "院系": inst,
        //             "用时": v.time_use,
        //             "成绩": v.score,
        //             "排名": v.rank
        //         })
        //         i++;
        //     })
        //  }
        //  )
        //  that.setState({origionData:data,loading:false});
        //测试结束

        this.setState({loading:true});
        fetch("http://" + that.props.state.host + "/api/admin/getBydepartment",
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "authorization": that.props.state.token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Username: that.props.state.username,
                    Department: that.props.state.departId
                })
            }).then(res => res.json()
            ).then(data => {
                Object.keys(data).forEach((inst) => {
                    if (!data[inst].length==0) {
                        data[inst].sort((a, b) => { return b.score - a.score })
                        data[inst].forEach((per, rank) => {
                            per.rank = rank + 1;
                        })
                        that.state.departList.push({
                            text:inst,
                            value:inst
                        })
                    }
                    data[inst].forEach((v) => {
                        that.state.displayData.push({
                            "学号": v.username,
                            "姓名": v.name,
                            "一卡通": v.password,
                            "院系": inst,
                            "用时": v.time_use,
                            "成绩": v.score,
                            "排名": v.rank
                        })
                    })
                }
                )
                that.state.origionData = data;
                that.setState({loading:false});
            }
            )
    }
    register() {
        //注册函数
        let that = this;
        this.setState({ register: { post: true } });
        fetch("http://" + this.props.state.host + "/api/ui/register",
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "authorization": that.props.state.token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Name:that.state.register.name,
                    Username: that.state.register.username,
                    Password:that.state.register.password
                })
            }).then(res=>res.json()
                ).then(data=>{
                    if(data.status==200){
                        message.success("注册成功");
                        that.get();
                        that.setState({register:{post:false}})
                        setTimeout(() => {
                            that.setState({register:{Visible:false}})
                        }, 400);
                    }
                    else if(data.status==403){
                        message.warning("该用户(学号)已存在");
                        that.setState({register:{post:false}})
                    }
                    else if(data.status==400){
                        message.warning("用户名或密码格式不正确");
                        that.setState({register:{post:false}})
                    }
                })
    }
    reset() {
        //修改信息
        let that=this;
        this.setState({reset:{post:true}});
        let add="";
        if(that.state.reset.attemp=="修改姓名"){
            add="/api/admin/reset_name"
        }
        else if(that.state.reset.attemp=="修改学号"){
            add="/api/admin/reset_username"
        }
        else if(that.state.reset.attemp=="修改一卡通"){
            add="/api/admin/reset_password"
        }
        console.log(that.state.reset.name);
        console.log(that.state.reset.username);
        console.log(that.state.reset.password);
        fetch("http://"+that.props.state.host+add,{
            method: 'POST',
            mode: 'cors',
            headers: {
                "authorization": that.props.state.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Name:that.state.reset.name,
                Username: that.state.reset.username,
                Password:that.state.reset.password
            })
        }).then((res)=>res.json()
        ).then((data)=>{
            if(data.msg==undefined){
                that.setState({reset:{post:false}});
                message.error("修改失败,请检查后重试");
            }
            else{
                message.success("修改成功");
                that.setState({reset:{post:false}});
                setTimeout(()=>{that.setState({reset:{Visible:false}})},400)
            }
        })
    }

    componentWillMount() {
        this.get();
    }


    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`按 ${dataIndex}查找`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    查找
            </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    重置
            </Button>
            </div>
        ),

        filterIcon: filtered => (
            <Icon type="search" size="large" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),

        onFilter: (value, record) =>
            record[dataIndex].includes(value),

        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },

    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    render() {
        let title = [
            {
                title: "院系",
                dataIndex: "院系",
                key: "院系",
                width: "16%",
                filters: this.state.departList,
                onFilter: (value, record) => {
                    return record["院系"] == value;
                }
            },
            {
                title: "姓名",
                dataIndex: "姓名",
                key: "姓名",
                width: "10%",
                ...this.getColumnSearchProps("姓名")
            },
            {
                title: "学号",
                dataIndex: "学号",
                key: "学号",
                width: "12%",
                sorter: (a, b) => a["学号"] - b["学号"],
                ...this.getColumnSearchProps("学号")
            },
            {
                title: "一卡通",
                dataIndex: "一卡通",
                key: "一卡通",
                width: "12%",
                ...this.getColumnSearchProps("一卡通")
            },

            {
                title: "成绩",
                dataIndex: "成绩",
                key: "成绩",
                width: "10%",
                filters: [{ text: "90分以上", value: "90分以上" }, { text: "60分-90分   ", value: "60-90" }, { text: "60分以下", value: "60分以下" }, { text: "已完成", value: "已完成" }, { text: "未完成", value: "未完成" }],
                onFilter: (value, record) => {
                    if (value == "已完成") {
                        return record["成绩"] >= 0;
                    }
                    else if (value == "90分以上") {
                        return record["成绩"] >= 90;
                    }
                    else if (value == "60-90") {
                        return record["成绩"] >= 60 && record["成绩"] < 90;
                    }
                    else if (value == "60分以下") {
                        return record["成绩"] >= 0 && record["成绩"] < 60;
                    }
                    else {
                        return record["成绩"] == -1
                    }
                },
                sorter: (a, b) => a["成绩"] - b["成绩"],
                render(score) {
                    if (score >= 90) {
                        return <Tag color="green">{score}</Tag>
                    }
                    else if (score >= 0) {
                        return <Tag color="blue">{score}</Tag>
                    }
                    else {
                        return <Tag color="#f50">未答题</Tag>
                    }
                },
            },
            {
                title: "用时",
                dataIndex: "用时",
                key: "用时",
                width: "10%",
                sorter: (a, b) => a["用时"] - b["用时"],
                render(h) {
                    if(h>=0){
                        return h + " s";
                    }
                    else{
                        return "无"
                    }
                },
            },
            {
                title: "本院排名",
                dataIndex: "排名",
                key: "排名",
                width: "12%",
                ...this.getColumnSearchProps("排名"),
                sorter: (a, b) => a["排名"] - b["排名"],
            },
            {
                title: "答题详情",
                dataIndex: "答题详情",
                key: "答题详情",
                width: "10%",
                render(e) {

                },
            },
        ]
        let titleDepart=[
            {
                title:"排名",
                dataIndex:"排名",
                key:"排名",
                width:"20%",
            },
            {
                title:"学院",
                dataIndex:"学院",
                key:"学院",
                width:"60%",
                // render:(data)=>(<div>
                //     <Popover title="院系数据" trigger="hover" content={<div>
                //     <p>均分: {departInfo[data].average}</p>
                //     <p>总人数:{departInfo[data].num}</p>
                //     </div>
                //     }>
                //         <Button type="default"  size="samll" ><Icon type="search"/></Button>
                //     </Popover>
                //     {data}
                //     </div>
                // )
            },
            {
                title:"均分",
                dataIndex:"均分",
                key:"均分",
                width:"20%"
            }
        ]
        return (
            <React.Fragment>
                <Drawer
                title="院系总览"
                placement="left"
                closable={true}
                onClose={()=>{this.setState({departVisible:false})}}
                visible={this.state.departVisible}
                width="400px"
                keyboard={true}
                >
                <Table columns={titleDepart} dataSource={this.state.departData}></Table>
                </Drawer>
                <Modal
                    title="注册"
                    visible={this.state.register.Visible}
                    onCancel={() => { this.setState({ register: { Visible: false } }) }}
                    footer={[
                        <Button key="返回" type="defult" onClick={() => { this.setState({ register: { Visible: false } }) }}>
                            返回
              </Button>,
                        <Button key="注册" type="primary" onClick={this.register} loading={this.state.register.post}>
                            <Icon type="check-circle" theme="twoTone" />
                            注册
              </Button>
                    ]}
                    visible={this.state.register.Visible}
                >   <Input id="name" addonBefore=" 姓名 " placeholder="注册姓名" allowClear onChange={(e) => { this.state.register.name=e.target.value}}></Input>
                    <p></p>
                    <Input id="username" addonBefore=" 账户 " placeholder="学号" allowClear onChange={(e) => { this.state.register.username=e.target.value }}></Input>
                    <p></p>
                    <Input.Password id="password" addonBefore=" 密码 " placeholder="一卡通号码" allowClear onChange={(e) => { this.state.register.password=e.target.value }} />
                    <p></p>

                </Modal>
                <Modal
                    title={this.state.reset.attemp}
                    visible={this.state.reset.Visible}
                    onCancel={() => { this.setState({ reset: { Visible: false } }) }}
                    footer={[
                        <Button key="返回" type="defult" onClick={() => { this.setState({ reset: { Visible: false } }) }}>
                            返回
                        </Button>,
                        <Button key="注册" type="primary" onClick={this.reset} loading={this.state.reset.post}>
                            <Icon type="check-circle" theme="twoTone" />
                            确认修改
                         </Button>
                    ]}
                    visible={this.state.reset.Visible}
                >
                    {this.state.reset.attemp == "修改一卡通" && <div>
                        <p><Icon type="exclamation" />推荐先在详细列表中, 利用搜索功能确定该学生具体的信息错误处</p>
                        <Input id="username" addonBefore=" 姓名 " placeholder="需要修改的账户(姓名)" allowClear onChange={(e) => { this.state.reset.name=e.target.value }}></Input>
                        <p></p>
                        <Input id="username" addonBefore=" 账户 " placeholder="需要修改的账户(学号)" allowClear onChange={(e) => { this.state.reset.username=e.target.value }}></Input>
                        <p></p>
                        <p></p>
                        <Input id="password" addonBefore=" 一卡通修改为 " placeholder="修改值" allowClear onChange={(e) => { this.state.reset.password=e.target.value }} ></Input>
                        <p></p>
                    </div>
                    }
                    {this.state.reset.attemp == "修改姓名" && <div>
                        <p><Icon type="exclamation" />推荐先在详细列表中, 利用搜索功能确定该学生具体信息错误处</p>
                        <Input id="username" addonBefore=" 学号 " placeholder="需要修改的账户(学号)" allowClear onChange={(e) => { this.state.reset.username=e.target.value }}></Input>
                        <p></p>
                        <Input id="username" addonBefore=" 一卡通 " placeholder="需要修改的账户(一卡通)" allowClear onChange={(e) => { this.state.reset.password=e.target.value }}></Input>
                        <p></p>
                        <p></p>
                        <Input id="password" addonBefore=" 姓名修改为 " placeholder="修改值" allowClear onChange={(e) => { this.state.reset.name=e.target.value }} ></Input>
                        <p></p>
                    </div>
                    }
                    {this.state.reset.attemp == "修改学号" && <div>
                        <p><Icon type="exclamation" />推荐先在详细列表中, 利用搜索功能确定该学生具体信息错误处</p>
                        <Input id="username" addonBefore=" 姓名 " placeholder="需要修改的账户(姓名)" allowClear onChange={(e) => { this.state.reset.name=e.target.value }}></Input>
                        <p></p>
                        <Input id="username" addonBefore=" 一卡通 " placeholder="需要修改的账户(一卡通)" allowClear onChange={(e) => { this.state.reset.password=e.target.value }}></Input>
                        <p></p>
                        <p></p>
                        <Input id="password" addonBefore=" 学号修改为 " placeholder="修改值" allowClear onChange={(e) => { this.state.reset.username=e.target.value }} ></Input>
                        <p></p>

                    </div>
                    }


                </Modal>
                <Layout>
                    <Header>
                        <Row>
                            <Col span={12}>
                                <h1 style={{ color: 'white', fontSize: "25px" }}><img src={mark} height="45px" width="45px" />&nbsp;校史校情知识竞赛&nbsp;&nbsp;管理系统</h1><br/>
                                
                            </Col>
                            <Col span={2} offset={8}>
                                <Button ghost type="primary" onClick={this.get}><Icon type="redo" spin={this.state.loading}/>刷新</Button>
                            </Col> <Col span={2} >
                                <Button ghost type="dashed" onClick={this.props.logout}><Icon type="logout" />退出</Button>
                            </Col>
                        </Row>
                    </Header>
                    <Content>
                        <Row>
                            <Col span={20} offset={2}>
                                <Descriptions bordered title={
                                    <Row>
                                        <Col span={10}>
                                            <p style={{ fontSize: "30px", marginTop: '20px' }}>{this.state.depart}学院&nbsp;统计信息</p>
                                            <Button type="primary" size="small" onClick={()=>{this.setState({departVisible:true})}}><Icon type="menu-unfold" /> 全校院系排名</Button>
                                            </Col>
                                        
                                        <Col span={2} offset={9}>
                                            <div style={{ marginTop: '20px' }}><Button type="primary" size="large"
                                                onClick={() => { this.setState({ register: { Visible: true } }) }}>
                                                学生注册
                                                </Button>
                                            </div>

                                        </Col>
                                        <Col span={2} offset={0}>

                                            <div style={{ marginTop: '20px' }}>
                                                <Dropdown overlay={
                                                    <Menu>
                                                        <Menu.Item onClick={() => { this.setState({ reset: { Visible: true, attemp: "修改姓名" } }) }}>修改学生姓名</Menu.Item>
                                                        <Menu.Item onClick={() => { this.setState({ reset: { Visible: true, attemp: "修改学号" } }) }}>修改学生学号</Menu.Item>
                                                        <Menu.Item onClick={() => { this.setState({ reset: { Visible: true, attemp: "修改一卡通" } }) }}>修改学生一卡通</Menu.Item>
                                                    </Menu>
                                                }>
                                                    <Button type="primary" size="large">
                                                        修改学生信息<Icon type="down" />
                                                    </Button>
                                                </Dropdown>
                                            </div>
                                        </Col>
                                    </Row>
                                }
                                layout="vertical"
                                column={4}>
                                    <Descriptions.Item label="总人数">{this.state.num}</Descriptions.Item>
                                    <Descriptions.Item label="已完成人数">{this.state.numOfDone}</Descriptions.Item>
                                    <Descriptions.Item label="平均分">{this.state.average}</Descriptions.Item>
                                    <Descriptions.Item label="院系均分排名">{this.state.rank}</Descriptions.Item>
                                </Descriptions>
                                <Table
                                    columns={title}
                                    loading={this.state.loading} bordered
                                    dataSource={this.state.displayData}
                                    size="small"
                                    title={() => {
                                        return (
                                            <Row>
                                                <Col span={4}>
                                                    <h1 style={{ fontSize: "20px" }}>学生详细列表</h1>
                                                </Col>
                                                <Col span={2} offset={18}>
                                                    <Button type="primary" size="default" onClick={this.exportByExcel} loading={this.state.export.loading}>导出为<Icon type="file-excel" /></Button>
                                                </Col>
                                            </Row>
                                        )
                                    }}
                                >

                                </Table>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </React.Fragment>
        )
    }
}

export default Admin

