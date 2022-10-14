import { GameModel } from "../../models/GameModel";
import "./games.sass"

export default function GamesListItem({game} : { game: GameModel }) {
    return <div className={"gamesListItem"}>
        <h2>{game.gameName}</h2>
        <p>
            Id={game.id}, Description='{game.description}'
        </p>
    </div>
}