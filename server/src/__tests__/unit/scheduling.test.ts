describe('Scheduling Overlap Detection', () => {
  const checkOverlap = (
    newStart: Date,
    newEnd: Date,
    existingStart: Date,
    existingEnd: Date
  ): boolean => {
    return newStart < existingEnd && newEnd > existingStart;
  };

  describe('Non-Overlapping Appointments', () => {
    it('should allow appointment before existing appointment', () => {
      const existing = {
        start: new Date('2025-10-14T08:00:00'),
        end: new Date('2025-10-14T09:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T07:00:00'),
        end: new Date('2025-10-14T08:00:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(false);
    });

    it('should allow appointment after existing appointment', () => {
      const existing = {
        start: new Date('2025-10-14T08:00:00'),
        end: new Date('2025-10-14T09:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T09:00:00'),
        end: new Date('2025-10-14T10:00:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(false);
    });

    it('should allow appointment well before existing', () => {
      const existing = {
        start: new Date('2025-10-14T14:00:00'),
        end: new Date('2025-10-14T16:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T09:00:00'),
        end: new Date('2025-10-14T10:00:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(false);
    });

    it('should allow appointment well after existing', () => {
      const existing = {
        start: new Date('2025-10-14T08:00:00'),
        end: new Date('2025-10-14T09:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T15:00:00'),
        end: new Date('2025-10-14T17:00:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(false);
    });
  });

  describe('Overlapping Appointments', () => {
    it('should detect overlap when new starts during existing', () => {
      const existing = {
        start: new Date('2025-10-14T08:00:00'),
        end: new Date('2025-10-14T09:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T08:00:00'),
        end: new Date('2025-10-14T08:30:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(true);
    });

    it('should detect overlap when new ends during existing', () => {
      const existing = {
        start: new Date('2025-10-14T08:00:00'),
        end: new Date('2025-10-14T09:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T08:45:00'),
        end: new Date('2025-10-14T09:15:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(true);
    });

    it('should detect overlap when new completely contains existing', () => {
      const existing = {
        start: new Date('2025-10-14T09:00:00'),
        end: new Date('2025-10-14T10:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T08:00:00'),
        end: new Date('2025-10-14T11:00:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(true);
    });

    it('should detect overlap when existing completely contains new', () => {
      const existing = {
        start: new Date('2025-10-14T08:00:00'),
        end: new Date('2025-10-14T12:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T09:00:00'),
        end: new Date('2025-10-14T10:00:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(true);
    });

    it('should detect overlap with exact same times', () => {
      const existing = {
        start: new Date('2025-10-14T10:00:00'),
        end: new Date('2025-10-14T11:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T10:00:00'),
        end: new Date('2025-10-14T11:00:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(true);
    });

    it('should detect partial overlap at start', () => {
      const existing = {
        start: new Date('2025-10-14T10:00:00'),
        end: new Date('2025-10-14T12:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T09:30:00'),
        end: new Date('2025-10-14T10:30:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(true);
    });

    it('should detect partial overlap at end', () => {
      const existing = {
        start: new Date('2025-10-14T08:00:00'),
        end: new Date('2025-10-14T10:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T09:30:00'),
        end: new Date('2025-10-14T11:00:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(true);
    });
  });

  describe('Edge Cases - Back-to-Back Appointments', () => {
    it('should allow back-to-back appointments (no gap)', () => {
      const existing = {
        start: new Date('2025-10-14T08:00:00'),
        end: new Date('2025-10-14T09:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T09:00:00'),
        end: new Date('2025-10-14T10:00:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(false);
    });

    it('should allow appointment ending exactly when next starts', () => {
      const existing = {
        start: new Date('2025-10-14T10:00:00'),
        end: new Date('2025-10-14T12:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T08:00:00'),
        end: new Date('2025-10-14T10:00:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(false);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle full day schedule without conflicts', () => {
      const appointments = [
        { start: new Date('2025-10-14T08:00:00'), end: new Date('2025-10-14T09:00:00') },
        { start: new Date('2025-10-14T09:00:00'), end: new Date('2025-10-14T11:00:00') },
        { start: new Date('2025-10-14T11:00:00'), end: new Date('2025-10-14T12:00:00') },
        { start: new Date('2025-10-14T14:00:00'), end: new Date('2025-10-14T16:00:00') },
      ];

      for (let i = 0; i < appointments.length - 1; i++) {
        for (let j = i + 1; j < appointments.length; j++) {
          const overlaps = checkOverlap(
            appointments[i].start,
            appointments[i].end,
            appointments[j].start,
            appointments[j].end
          );
          expect(overlaps).toBe(false);
        }
      }
    });

    it('should detect conflict in busy schedule', () => {
      const existingAppointments = [
        { start: new Date('2025-10-14T08:00:00'), end: new Date('2025-10-14T10:00:00') },
        { start: new Date('2025-10-14T10:00:00'), end: new Date('2025-10-14T12:00:00') },
        { start: new Date('2025-10-14T13:00:00'), end: new Date('2025-10-14T15:00:00') },
      ];

      const newAppointment = {
        start: new Date('2025-10-14T11:30:00'),
        end: new Date('2025-10-14T13:30:00')
      };

      const hasConflict = existingAppointments.some(existing =>
        checkOverlap(
          newAppointment.start,
          newAppointment.end,
          existing.start,
          existing.end
        )
      );

      expect(hasConflict).toBe(true);
    });
  });

  describe('Minute-Level Precision', () => {
    it('should detect 1-minute overlap', () => {
      const existing = {
        start: new Date('2025-10-14T10:00:00'),
        end: new Date('2025-10-14T11:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T10:59:00'),
        end: new Date('2025-10-14T12:00:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(true);
    });

    it('should allow appointment with 1-minute gap', () => {
      const existing = {
        start: new Date('2025-10-14T10:00:00'),
        end: new Date('2025-10-14T11:00:00')
      };

      const newAppointment = {
        start: new Date('2025-10-14T07:00:00'),
        end: new Date('2025-10-14T07:59:00')
      };

      const overlaps = checkOverlap(
        newAppointment.start,
        newAppointment.end,
        existing.start,
        existing.end
      );

      expect(overlaps).toBe(false);
    });
  });
});
