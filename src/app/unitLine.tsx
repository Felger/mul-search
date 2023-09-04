import { AddUnitCallback } from "./unitListApi"

type comparator = (a: IUnit, b: IUnit) => number

function normalizeMove(move: string) {
    // For jmpw or jmps there will be 2 components, we'll consider normal move first
    const components = move.split('/')[0].split('"')
    const normalizedSpeed = components[0].padStart(3, "0")
    const normalizedType = (components.length > 1) ? components[1] : "0"
    return normalizedSpeed + normalizedType
}

export const UnitComparators: Record<string, comparator> = {
    Name: (a, b) => a.Name.localeCompare(b.Name),
    BFPointValue: (a, b) => a.BFPointValue - b.BFPointValue,
    BFMove: (a, b) => {
        const movA = a.BFMove
        const movB = b.BFMove
        const order = normalizeMove(movA).localeCompare(normalizeMove(movB))
        return (order != 0) ? order : movA.length - movB.length
    },
    SyntHP: (a, b) => a.BFStructure + a.BFArmor - b.BFStructure - b.BFArmor
}

export interface IRole {
    Name: string,
}

export interface IUnit {
    Id: number,
    Name: string,
    Role: IRole,
    BFDamageShort: number,
    BFDamageMedium: number,
    BFDamageLong: number,
    BFMove: string,
    BFPointValue: number,
    BFArmor: number,
    BFStructure: number,
    BFAbilities: string,
}


export function UnitHeader() {
    return (
        <div className="grid grid-cols-12 my-0 font-bold text-center items-center">
            <div className="col-span-3 text-left">
                Name
            </div>
            <div className="col-start-4">PV</div>
            <div>Role</div>
            <div>Move</div>
            <div>Damage<br />(S/M/L)</div>
            <div>HP<br />(A + S)</div>
            <div className="col-span-3 text-left">Abilities...</div>
        </div>
    )
}

export default function UnitLine({ unit, onAdd }: { unit: IUnit, onAdd: AddUnitCallback }) {

    const onAddClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        console.log(onAdd)
        onAdd(unit)
    }

    return (
            <>
            <div className="grid grid-cols-12 my-0 border border-solid border-gray-400 dark:border-gray-800 font-small text-center items-center">
                <div className="col-span-3 text-left">
                    <a href={"http://www.masterunitlist.info/Unit/Details/" + unit.Id} target="_blank">{unit.Name}</a>
                </div>
                <div className="col-start-4">{unit.BFPointValue}</div>
                <div>{unit.Role.Name}</div>
                <div>{unit.BFMove}</div>
                <div>{unit.BFDamageShort}/{unit.BFDamageMedium}/{unit.BFDamageLong}</div>
                <div>{unit.BFArmor} + {unit.BFStructure}</div>
                <div className="text-xs truncate col-span-3 text-left">{unit.BFAbilities}</div>
                <a className="block text-center font-bold text-xs" onClick={onAddClick} href="#">
                    +
                </a>
            </div>
            </>
    )
}