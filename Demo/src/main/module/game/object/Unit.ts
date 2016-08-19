/**
 *
 * @author 
 *
 */
class Unit extends BaseGameObject {

    protected id: number;
    protected hp: number;
    protected state: UnitState;
    protected freezTime: number;

    public constructor($controller: BaseController) {
        super($controller);
    }

    public init(id: number,side: Side): void {
        super.init(side);
        this.id = id;
    }

    protected addHp(value: number) {

    }

    protected subHp(value: number) {

    }

    public Hurt(damage: number) {

    }
    
    public Freez(duration: number) {
        this.state = UnitState.Freez;
        this.freezTime = duration;
    }
    
    public update(time: number) {
        super.update(time);
    }
}

enum UnitState {
    Move,
    Idle,
    Dodge,
    Hurt,
    Freez,
    Release,
    Die
}
