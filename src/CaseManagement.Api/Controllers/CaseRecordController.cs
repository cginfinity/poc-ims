using CaseManagement.Api.Data;
using CaseManagement.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CaseManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CaseRecordController : ControllerBase
    {
        private readonly CaseManagementDbContext _context;

        public CaseRecordController(CaseManagementDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CaseRecord>>> GetCaseRecords()
        {
            return await _context.Cases.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CaseRecord>> GetCaseRecord(int id)
        {
            var caseRecord = await _context.Cases.FindAsync(id);

            if (caseRecord is null)
            {
                return NotFound();
            }

            return caseRecord;
        }

        [HttpGet("beneficiary/{beneficiaryId}")]
        public async Task<ActionResult<IEnumerable<CaseRecord>>> GetCasesByBeneficiaryId(int beneficiaryId)
        {
            var cases = await _context.Cases
                .Where(c => c.BeneficiaryId == beneficiaryId)
                .ToListAsync();

            return cases;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCaseRecord(int id, CaseRecord caseRecord)
        {
            if (id != caseRecord.CaseId)
            {
                return BadRequest();
            }

            _context.Entry(caseRecord).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CaseRecordExists(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<CaseRecord>> PostCaseRecord(CaseRecord caseRecord)
        {
            _context.Cases.Add(caseRecord);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCaseRecord), new { id = caseRecord.CaseId }, caseRecord);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCaseRecord(int id)
        {
            var caseRecord = await _context.Cases.FindAsync(id);
            if (caseRecord is null)
            {
                return NotFound();
            }

            _context.Cases.Remove(caseRecord);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CaseRecordExists(int id)
        {
            return _context.Cases.Any(e => e.CaseId == id);
        }
    }
}
