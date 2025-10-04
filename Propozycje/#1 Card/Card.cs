// C# - model karty
public class Card
{
    public string Id { get; set; }
    public string Title { get; set; }          // np. "Mam żonę"
    public string Description { get; set; }    // opis sytuacji
    public List<DecisionOption> Options { get; set; }
    public string Mode { get; set; }           // "adult" / "kids"
    public string IconPath { get; set; }
}

public class DecisionOption
{
    public string Id { get; set; }
    public string Text { get; set; }           // etykieta przycisku
    public List<Effect> Effects { get; set; }  // co się zmienia (pieniądze, stres, relacje)
    public int RiskLevel { get; set; }         // 0 low, 1 med, 2 high
}

public class Effect
{
    public string Stat { get; set; }   // "money", "stress", "happiness"
    public int Delta { get; set; }     // +/-
}
