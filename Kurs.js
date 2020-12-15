using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication22
{
    public class CoffeeMachine
{
    public enum State { Off, On, Fail, Accept, Check, Complete };

    public class MenuItem
{
    public string Name { get; set; }
    public int Price { get; set; }
    public int Index { get; set; }

    public override string ToString()
    {
        return string.Format("{0}. {1}  Цена: {2}", Index, Name, Price);
    }
}

    State state = State.Off;
    List<MenuItem> menu = new List<MenuItem>();

    public event EventHandler<State> ChangeState;

    public CoffeeMachine(bool powerOn = false)
    {
        menu.Add(new MenuItem() { Index = 1, Name = "Капучино", Price = 42 });
        menu.Add(new MenuItem() { Index = 2, Name = "Лате", Price = 35 });
        menu.Add(new MenuItem() { Index = 3, Name = "Чай", Price = 20 });
        menu.Add(new MenuItem() { Index = 4, Name = "Кофе", Price = 40 });
        menu.Add(new MenuItem() { Index = 5, Name = "Горячий шоколад", Price = 40 });
        menu.Add(new MenuItem() { Index = 6, Name = "Двойной шоколад", Price = 50 });
        menu.Add(new MenuItem() { Index = 7, Name = "Кофе с молоком", Price = 45 });
    }

    public void Power(bool powerOn)
    {
        state = powerOn == true ? State.On : State.Off;
        Change();
    }

    private void Change()
    {
        if (ChangeState != null) ChangeState(this, state);
    }

    public string[] PrintMenu()
    {
        if (state != State.On) return new string[1] { "Машина не готова." };
        return menu.Select(x => x.ToString()).ToArray();
    }

    public int Work(int menuNumber, int cash)
    {
        state = State.Check; Change();

        var menuItem = menu.Where(x => x.Index == menuNumber).FirstOrDefault();
        if (menuItem == null || cash - menuItem.Price < 0)
        {
            state = State.Fail; Change();
            Console.WriteLine("Элемент отсутствует в меню или у вас недостаточно денег.");
            return cash;
        }

        state = State.Accept; Change();

        //....
        state = State.Complete; Change();

        return cash - menuItem.Price;
    }
}

    public class Program
{
    static void Main(string[] args)
{
    Console.WriteLine("Внесите сумму денег");
    string rnd = Console.ReadLine();
    int cash = Convert.ToInt32(rnd);

    CoffeeMachine machine = new CoffeeMachine();
    machine.ChangeState += machine_ChangeState;
    machine.Power(true);

    Console.WriteLine("\t Меню \n");
    Console.WriteLine(string.Join("\n", machine.PrintMenu()));

    Console.Write("\nУ вас {0} денег.\nВыберите номер напитока:", cash);
    int select = int.Parse(Console.ReadLine());

    Console.WriteLine("Все готово. Остаток средств: {0}", machine.Work(select, cash));

    Console.ReadKey(true);
}

    static void machine_ChangeState(object sender, CoffeeMachine.State e)
    {
        switch (e)
        {
            case CoffeeMachine.State.On:
                Console.WriteLine("Машина включена.");
                break;
            case CoffeeMachine.State.Fail:
                Console.WriteLine("Ошибка.");
                break;
            case CoffeeMachine.State.Complete:
                Console.WriteLine("Выполнено.");
                break;
        }
    }
}
}
