using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;

public class MainWindowViewModel : INotifyPropertyChanged
{
    public Card CurrentCard { get; set; }
    public PlayerState Player { get; set; } = new PlayerState { Money = 100, Stress = 10, Happiness = 50 };

    public ICommand ChooseOptionCommand { get; }

    public MainWindowViewModel()
    {
        // przykładowa karta
        CurrentCard = new Card {
            Id = "card_001",
            Title = "Wziąłem żonę",
            Description = "Co wybierasz?",
            Options = new List<DecisionOption> {
                new DecisionOption {
                    Id = "opt1", Text = "Spędzić czas z żoną",
                    Effects = new List<Effect> { new Effect{Stat="happiness",Delta=10}, new Effect{Stat="money",Delta=-20} }
                },
                new DecisionOption {
                    Id = "opt2", Text = "Zostać na nadgodziny",
                    Effects = new List<Effect> { new Effect{Stat="money",Delta=200}, new Effect{Stat="stress",Delta=15}, new Effect{Stat="happiness",Delta=-8} }
                }
            }
        };

        ChooseOptionCommand = new RelayCommand<DecisionOption>(ApplyOption);
    }

    private void ApplyOption(DecisionOption opt)
    {
        foreach(var e in opt.Effects)
        {
            switch(e.Stat)
            {
                case "money": Player.Money += e.Delta; break;
                case "stress": Player.Stress = Math.Max(0, Player.Stress + e.Delta); break;
                case "happiness": Player.Happiness = Math.Clamp(Player.Happiness + e.Delta, 0, 100); break;
            }
        }

        OnPropertyChanged(nameof(Player));
        // tutaj: decyzja może wygenerować następną kartę — DecisionEngine.GenerateNextCard(Player, opt)
    }

    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged([CallerMemberName]string n=null) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(n));
}

// Prosty RelayCommand
public class RelayCommand<T> : ICommand
{
    private readonly Action<T> _exec;
    public RelayCommand(Action<T> exec) => _exec = exec;
    public bool CanExecute(object parameter) => true;
    public void Execute(object parameter) => _exec((T)parameter);
    public event EventHandler CanExecuteChanged { add {} remove {} }
}
