namespace PcbDefectLogger.Models;

public class Defect
{
    public int Id { get; set; }
    public string LotNumber { get; set; } = string.Empty;
    public int GridX { get; set; }
    public int GridY { get; set; }
    public string DefectType { get; set; } = "Scratch";
    public DateTime RecordedAt { get; set; } = DateTime.Now;
    public string? Notes { get; set; }
}