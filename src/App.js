import React from 'react'
import { View, Text, Button, Image } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import CodePush from 'react-native-code-push' // 引入code-push

let codePushOptions = {
  //设置检查更新的频率
  //ON_APP_RESUME APP恢复到前台的时候
  //ON_APP_START APP开启的时候
  //MANUAL 手动检查
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME
}

class LogoTitle extends React.Component {
  render() {
    return (
      <Image source={require('./logo.png')} style={{ width: 30, height: 30 }} />
    )
  }
}
class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: <LogoTitle />,
    headerLeft: (
      <Button
        onPress={() => navigation.navigate('MyModal')}
        title="Info"
        color="#fff"
      />
    ),
    headerRight: (
      <Button
        onPress={navigation.getParam('increaseCount')}
        title="+1"
        color="#fff"
      />
    )
  })

  componentDidMount() {
    this.props.navigation.setParams({ increaseCount: this._increaseCount })
  }

  state = {
    count: 0
  }

  _increaseCount = () => {
    this.setState({ count: this.state.count + 2 })
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen {this.state.count}</Text>
        <Button
          title="Go to Details"
          onPress={() =>
            this.props.navigation.navigate('Details', {
              itemId: 89,
              otherParam: 'anything you want here',
              title: '详情'
            })
          }
        />
      </View>
    )
  }
}

class DetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'A Nested Details Screen')
    }
  }

  render() {
    const { navigation } = this.props
    const itemId = navigation.getParam('itemId', 'NO-ID')
    const otherParam = navigation.getParam('otherParam', 'some default value')
    const ID = navigation.getParam('ID', 'NO-ID')

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Text>ID: {JSON.stringify(ID)}</Text>
        <Text>itemId: {JSON.stringify(itemId)}</Text>
        <Text>otherParam: {JSON.stringify(otherParam)}</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.push('Details')}
        />
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
        <Button
          title="Update the title"
          onPress={() => this.props.navigation.setParams({ title: 'Updated!' })}
        />
      </View>
    )
  }
}

class ModalScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
      </View>
    )
  }
}

const MainStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }
  }
)

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack
    },
    MyModal: {
      screen: ModalScreen
    }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

const AppContainer = createAppContainer(RootStack)

class App extends React.Component {
  //如果有更新的提示
  syncImmediate() {
    CodePush.sync({
      //安装模式
      //ON_NEXT_RESUME 下次恢复到前台时
      //ON_NEXT_RESTART 下一次重启时
      //IMMEDIATE 马上更新
      installMode: CodePush.InstallMode.IMMEDIATE,
      //对话框
      updateDialog: {
        //是否显示更新描述
        appendReleaseDescription: true,
        //更新描述的前缀。 默认为"Description"
        descriptionPrefix: '更新内容：',
        //强制更新按钮文字，默认为continue
        mandatoryContinueButtonLabel: '立即更新',
        //强制更新时的信息. 默认为"An update is available that must be installed."
        mandatoryUpdateMessage: '必须更新后才能使用',
        //非强制更新时，按钮文字,默认为"ignore"
        optionalIgnoreButtonLabel: '稍后',
        //非强制更新时，确认按钮文字. 默认为"Install"
        optionalInstallButtonLabel: '后台更新',
        //非强制更新时，检查到更新的消息文本
        optionalUpdateMessage: '有新版本了，是否更新？',
        //Alert窗口的标题
        title: '更新提示'
      }
    })
  }

  componentWillMount() {
    CodePush.disallowRestart() //页禁止重启
    this.syncImmediate() //开始检查更新
  }

  componentDidMount() {
    CodePush.allowRestart() //在加载完了，允许重启
  }
  render() {
    return <AppContainer />
  }
}

App = CodePush(codePushOptions)(App)

export default App
