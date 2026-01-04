const vscode = require('vscode');

function activate(context) {
    console.log('Showcase Read-Only Mode is now active');

    // Override the save command
    const saveDisposable = vscode.commands.registerCommand('workbench.action.files.save', async () => {
        showContributeMessage();
    });

    // Override save all command
    const saveAllDisposable = vscode.commands.registerCommand('workbench.action.files.saveAll', async () => {
        showContributeMessage();
    });

    // Custom command to show message
    const showMessageDisposable = vscode.commands.registerCommand('showcase.showContributeMessage', () => {
        showContributeMessage();
    });

    context.subscriptions.push(saveDisposable, saveAllDisposable, showMessageDisposable);

    // Show welcome message on startup
    vscode.window.showInformationMessage(
        '👋 Hi! 欢迎浏览我的代码~',
        '了解如何留言'
    ).then(selection => {
        if (selection === '了解如何留言') {
            showContributeMessage();
        }
    });
}

function showContributeMessage() {
    vscode.window.showInformationMessage(
        '👋 Hi! 这是只读展示模式。如果你想留下想法、评论或联系我，可以 Fork 这个项目后在你的副本中修改。你留下的每一条评论我都会阅读，有机会会保留下来让其他人也能看到~',
        'Fork 到 GitHub',
        '查看说明'
    ).then(selection => {
        if (selection === 'Fork 到 GitHub') {
            vscode.env.openExternal(vscode.Uri.parse('https://github.com/NatureBlueee/Digital-desktop/fork'));
        } else if (selection === '查看说明') {
            vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file('/home/coder/project/WELCOME.md'));
        }
    });
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};

