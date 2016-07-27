/**
 *
 * @author
 *
 */
var StartupCommand = (function (_super) {
    __extends(StartupCommand, _super);
    function StartupCommand() {
        _super.call(this);
    }
    var d = __define,c=StartupCommand,p=c.prototype;
    p.initializeMacroCommand = function () {
        this.addSubCommand(ControllerPrepCommand);
        this.addSubCommand(ModelPrepCommand);
        this.addSubCommand(ViewPrepCommand);
    };
    return StartupCommand;
}(puremvc.MacroCommand));
egret.registerClass(StartupCommand,'StartupCommand');
